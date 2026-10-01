# Genera versiones livianas de las imagenes del Tour 360.
#
#  - public/panoramas/_thumbs/<ruta>/<nombre>_<ext>.jpg
#      Miniaturas (512 px de ancho) para la galeria, los tooltips de las flechas
#      y las tarjetas del selector de sedes. Antes se usaba el panorama completo
#      (2-38 MB) incluso para mostrar una imagen de 72 px.
#
# Ejecutar desde la raiz del proyecto (es idempotente: solo regenera lo que cambio):
#   powershell -ExecutionPolicy Bypass -File scripts/generate-panorama-thumbs.ps1

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$panoramasDir = Join-Path $root 'public/panoramas'
$thumbsDir = Join-Path $panoramasDir '_thumbs'

$thumbWidth = 512

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$jpegParams = New-Object System.Drawing.Imaging.EncoderParameters 1
$jpegParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 72L

function Resize-Image {
  param([string]$Source, [string]$Target, [int]$Width, [int]$Height, [bool]$AsJpeg)

  $image = [System.Drawing.Image]::FromFile($Source)
  try {
    $format = if ($AsJpeg) { [System.Drawing.Imaging.PixelFormat]::Format24bppRgb } else { [System.Drawing.Imaging.PixelFormat]::Format32bppArgb }
    $bitmap = New-Object System.Drawing.Bitmap $Width, $Height, $format
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $graphics.DrawImage($image, 0, 0, $Width, $Height)
      $graphics.Dispose()

      New-Item -ItemType Directory -Force (Split-Path $Target) | Out-Null
      if ($AsJpeg) {
        $bitmap.Save($Target, $jpegCodec, $jpegParams)
      } else {
        $bitmap.Save($Target, [System.Drawing.Imaging.ImageFormat]::Png)
      }
    } finally {
      $bitmap.Dispose()
    }
  } finally {
    $image.Dispose()
  }
}

function Test-UpToDate([string]$Source, [string]$Target) {
  return (Test-Path $Target) -and ((Get-Item $Target).LastWriteTimeUtc -ge (Get-Item $Source).LastWriteTimeUtc)
}

function Get-ImageSize([string]$Path) {
  $image = [System.Drawing.Image]::FromFile($Path)
  try { return @($image.Width, $image.Height) } finally { $image.Dispose() }
}

$created = 0

# --- Miniaturas de panoramas ---
$panoramaFiles = Get-ChildItem $panoramasDir -Recurse -File -Include *.png, *.jpg, *.jpeg, *.webp |
  Where-Object {
    $relative = $_.FullName.Substring($panoramasDir.Length + 1)
    -not ($relative -match '^(_thumbs|iconos|iconos_optimized|maps)[\\/]')
  }

foreach ($file in $panoramaFiles) {
  $relative = $file.FullName.Substring($panoramasDir.Length + 1)
  $relativeDir = Split-Path $relative
  $thumbName = '{0}_{1}.jpg' -f $file.BaseName, $file.Extension.TrimStart('.').ToLowerInvariant()
  $target = if ($relativeDir) { Join-Path (Join-Path $thumbsDir $relativeDir) $thumbName } else { Join-Path $thumbsDir $thumbName }

  if (Test-UpToDate $file.FullName $target) { continue }

  $size = Get-ImageSize $file.FullName
  $height = [Math]::Max(1, [int][Math]::Round($thumbWidth * $size[1] / $size[0]))
  Resize-Image -Source $file.FullName -Target $target -Width $thumbWidth -Height $height -AsJpeg $true
  $created++
  Write-Host "thumb  $relative"
}

Write-Host "Listo: $created archivo(s) generado(s)."
