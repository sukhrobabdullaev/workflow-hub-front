import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

interface ImagePreviewModalProps {
    imageUrl: string;
    imageName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ImagePreviewModal = ({
    imageUrl,
    imageName,
    open,
    onOpenChange
}: ImagePreviewModalProps) => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = imageName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2">
                            {imageName}
                        </DialogTitle>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDownload}
                                className="flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex justify-center bg-black/5 rounded-lg p-4">
                    <img
                        src={imageUrl}
                        alt={imageName}
                        className="max-w-full max-h-[70vh] object-contain rounded-lg"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};
