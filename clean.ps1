Add-Type -AssemblyName System.Drawing
 = [System.Drawing.Bitmap]::FromFile((Resolve-Path assets/company_logo.png))
 = New-Object System.Drawing.Bitmap(.Width, .Height)
for ( = 0;  -lt .Width; ++) { for ( = 0;  -lt .Height; ++) {  = .GetPixel(, ); if (.R -gt 210 -and .G -gt 210 -and .B -gt 210) { .SetPixel(, , [System.Drawing.Color]::Transparent) } else { .SetPixel(, , ) } } }
.Save((Join-Path (Get-Location) assets/company_logo_clean.png), [System.Drawing.Imaging.ImageFormat]::Png)
.Dispose(); .Dispose()
