Add-Type -AssemblyName System.Drawing

$inputPath = "C:\Users\HP\Documents\CODING\GOLDENCAMELANDCOW\assets\company_logo.png"
$outputPath = "C:\Users\HP\Documents\CODING\GOLDENCAMELANDCOW\assets\company_logo_clean.png"

$bmp = [System.Drawing.Bitmap]::FromFile($inputPath)
$transparentBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $pixel = $bmp.GetPixel($x, $y)
        # Check if pixel is light background (R, G, B > 200)
        if ($pixel.R -gt 200 -and $pixel.G -gt 200 -and $pixel.B -gt 200) {
            $transparentBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
        } else {
            $transparentBmp.SetPixel($x, $y, $pixel)
        }
    }
}

$transparentBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$transparentBmp.Dispose()
Write-Host "Successfully generated transparent logo at $outputPath"
