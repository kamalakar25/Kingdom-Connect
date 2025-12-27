import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './dialog'
import { Button } from './button'
import { Slider } from './slider'
import getCroppedImg from '../../lib/canvasUtils'
import { Label } from './label'

type ImageCropperProps = {
    imageSrc: string | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onCropComplete: (croppedImageBlob: Blob) => void
}

export function ImageCropper({ imageSrc, open, onOpenChange, onCropComplete }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    const onCropChange = (crop: { x: number, y: number }) => {
        setCrop(crop)
    }

    const onZoomChange = (zoom: number) => {
        setZoom(zoom)
    }

    const onCropCompleteCallback = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleSave = async () => {
        if (!imageSrc || !croppedAreaPixels) return

        setIsLoading(true)
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
            if (croppedImage) {
                onCropComplete(croppedImage)
                onOpenChange(false)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    if (!imageSrc) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Adjust Profile Picture</DialogTitle>
                    <DialogDescription>
                        Drag to move and use the slider to zoom.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative w-full h-[50vh] min-h-[250px] sm:h-80 bg-black/5 rounded-lg overflow-hidden my-4">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteCallback}
                        onZoomChange={onZoomChange}
                        classes={{
                            containerClassName: "bg-background/50",
                            mediaClassName: "",
                            cropAreaClassName: "border-primary"
                        }}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Label>Zoom</Label>
                        <Slider
                            value={[zoom]}
                            min={1}
                            max={3}
                            step={0.1}
                            onValueChange={(value) => setZoom(value[0])}
                            className="flex-1"
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Profile Picture"}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
