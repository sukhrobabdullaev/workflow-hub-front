import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Video, Link, Upload } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';

interface RecordingLinkModalProps {
    taskId: string;
    onRecordingAdded?: () => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: React.ReactNode;
}

export const RecordingLinkModal = ({
    taskId,
    onRecordingAdded,
    open: externalOpen,
    onOpenChange: externalOnOpenChange,
    trigger
}: RecordingLinkModalProps) => {
    const [open, setOpen] = useState(false);

    // Use external control if provided, otherwise use internal state
    const isOpen = externalOpen !== undefined ? externalOpen : open;
    const setIsOpen = externalOnOpenChange || setOpen;
    const [recordingUrl, setRecordingUrl] = useState('');
    const [recordingTitle, setRecordingTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { addAttachment } = useAppStore();
    const user = useAuthStore(state => state.user);

    const handleAddRecording = async () => {
        if (!recordingUrl.trim() || !recordingTitle.trim() || !user) return;

        setIsLoading(true);

        try {
            // In a real app, you would validate the URL and get file size
            const attachment = {
                name: recordingTitle,
                url: recordingUrl,
                type: 'video' as const,
                size: 0, // Would be determined by the actual video
                uploadedBy: user.id,
            };

            addAttachment(taskId, attachment);

            setRecordingUrl('');
            setRecordingTitle('');
            setIsOpen(false);
            onRecordingAdded?.();
        } catch (error) {
            console.error('Failed to add recording:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const generateSampleRecording = () => {
        const sampleTitles = [
            'Screen recording demo',
            'Bug reproduction video',
            'Feature walkthrough',
            'Code review session',
            'Design feedback video'
        ];

        const randomTitle = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
        setRecordingTitle(randomTitle);
        setRecordingUrl(`https://example.com/recordings/${Date.now()}.webm`);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {trigger && (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            )}
            {!trigger && isOpen && (
                <DialogTrigger asChild>
                    <div style={{ display: 'none' }} />
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Video className="w-5 h-5" />
                        Add Video Recording
                    </DialogTitle>
                    <DialogDescription>
                        Add a link to your video recording or screen capture
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="title">Recording Title</Label>
                        <Input
                            id="title"
                            value={recordingTitle}
                            onChange={(e) => setRecordingTitle(e.target.value)}
                            placeholder="e.g., Bug reproduction video"
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <Label htmlFor="url">Recording URL</Label>
                        <Input
                            id="url"
                            value={recordingUrl}
                            onChange={(e) => setRecordingUrl(e.target.value)}
                            placeholder="https://example.com/recording.webm"
                            className="mt-2"
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={generateSampleRecording}
                            className="flex-1"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Generate Sample
                        </Button>
                        <Button
                            onClick={handleAddRecording}
                            disabled={!recordingUrl.trim() || !recordingTitle.trim() || isLoading}
                            className="flex-1"
                        >
                            {isLoading ? 'Adding...' : 'Add Recording'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
