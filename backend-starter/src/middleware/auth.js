const jwt = require('jsonwebtoken');
const db = require('../database/connection');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Access token required',
        },
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user with current workspace info
    const userResult = await db.query(
      `
      SELECT 
        u.*,
        COALESCE(
          json_agg(
            json_build_object(
              'workspaceId', w.id,
              'workspaceName', w.name,
              'role', wm.role,
              'isOwner', wm.is_owner,
              'joinedAt', wm.joined_at
            )
          ) FILTER (WHERE w.id IS NOT NULL), 
          '[]'::json
        ) as workspaces
      FROM users u
      LEFT JOIN workspace_memberships wm ON u.id = wm.user_id
      LEFT JOIN workspaces w ON wm.workspace_id = w.id
      WHERE u.id = $1
      GROUP BY u.id
    `,
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'User not found',
        },
      });
    }

    const user = userResult.rows[0];

    // Find current workspace role
    const currentWorkspace =
      user.workspaces.find(ws => ws.workspaceId === user.current_workspace_id) ||
      user.workspaces[0];

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      workspaces: user.workspaces,
      currentWorkspaceId: currentWorkspace?.workspaceId,
      currentRole: currentWorkspace?.role || null,
      isWorkspaceOwner: currentWorkspace?.isOwner || false,
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Invalid or expired token',
        },
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Authentication failed',
      },
    });
  }
};

// Middleware to check workspace role permissions
const requireRole = roles => {
  return (req, res, next) => {
    if (!req.user.currentRole || !roles.includes(req.user.currentRole)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'AUTHORIZATION_ERROR',
          message: 'Insufficient permissions',
        },
      });
    }
    next();
  };
};

// Middleware to check workspace ownership
const requireWorkspaceOwner = (req, res, next) => {
  if (!req.user.isWorkspaceOwner) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'AUTHORIZATION_ERROR',
        message: 'Workspace owner access required',
      },
    });
  }
  next();
};

module.exports = {
  authMiddleware,
  requireRole,
  requireWorkspaceOwner,
};
