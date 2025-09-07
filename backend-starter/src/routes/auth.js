const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../database/connection');
const emailService = require('../services/email');
const passport = require('passport');

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Generate JWT tokens
const generateTokens = userId => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

  return { accessToken, refreshToken };
};

// Register
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.mapped(),
        },
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists',
        },
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Start transaction
    await db.query('BEGIN');

    try {
      // Create user
      const userResult = await db.query(
        `
        INSERT INTO users (name, email, password_hash, plan)
        VALUES ($1, $2, $3, 'free')
        RETURNING id, name, email, plan, onboarding_completed, created_at
      `,
        [name, email, passwordHash]
      );

      const user = userResult.rows[0];

      // Create default workspace
      const workspaceResult = await db.query(
        `
        INSERT INTO workspaces (name, owner_id, plan)
        VALUES ($1, $2, 'free')
        RETURNING id, name
      `,
        [`${name}'s Workspace`, user.id]
      );

      const workspace = workspaceResult.rows[0];

      // Add user to workspace as admin and owner
      await db.query(
        `
        INSERT INTO workspace_memberships (workspace_id, user_id, role, is_owner)
        VALUES ($1, $2, 'admin', true)
      `,
        [workspace.id, user.id]
      );

      // Create subscription usage record
      await db.query(
        `
        INSERT INTO subscription_usage (workspace_id)
        VALUES ($1)
      `,
        [workspace.id]
      );

      await db.query('COMMIT');

      // Generate tokens
      const tokens = generateTokens(user.id);

      // Send welcome email
      await emailService.sendWelcomeEmail(user.email, user.name);

      res.status(201).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          onboardingCompleted: user.onboarding_completed,
          workspaces: [
            {
              workspaceId: workspace.id,
              workspaceName: workspace.name,
              role: 'admin',
              isOwner: true,
              joinedAt: user.created_at,
            },
          ],
          currentWorkspaceId: workspace.id,
        },
        tokens,
      });
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Registration failed',
      },
    });
  }
});

// Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.mapped(),
        },
      });
    }

    const { email, password } = req.body;

    // Get user with workspaces
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
      WHERE u.email = $1
      GROUP BY u.id
    `,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Invalid credentials',
        },
      });
    }

    const user = userResult.rows[0];

    // Check password
    if (!user.password_hash || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Invalid credentials',
        },
      });
    }

    // Generate tokens
    const tokens = generateTokens(user.id);

    // Set current workspace to first workspace if not set
    const currentWorkspaceId = user.workspaces.length > 0 ? user.workspaces[0].workspaceId : null;

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar_url,
        plan: user.plan,
        companyName: user.company_name,
        companySize: user.company_size,
        industry: user.industry,
        goals: user.goals || [],
        twoFactorEnabled: user.two_factor_enabled,
        onboardingCompleted: user.onboarding_completed,
        workspaces: user.workspaces,
        currentWorkspaceId,
      },
      tokens,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Login failed',
      },
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Refresh token required',
        },
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const tokens = generateTokens(decoded.userId);

    res.json({
      success: true,
      tokens,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Invalid refresh token',
      },
    });
  }
});

// Social authentication routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const tokens = generateTokens(req.user.id);
  res.redirect(
    `${process.env.FRONTEND_URL}/auth/callback?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`
  );
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { session: false }), (req, res) => {
  const tokens = generateTokens(req.user.id);
  res.redirect(
    `${process.env.FRONTEND_URL}/auth/callback?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`
  );
});

// Logout
router.post('/logout', (req, res) => {
  // In a production app, you might want to blacklist the token
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

module.exports = router;
