Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$assetDir = Join-Path $root ".github\assets"
$outputPath = Join-Path $assetDir "social-preview.png"

New-Item -ItemType Directory -Force -Path $assetDir | Out-Null

function New-RoundedRectanglePath {
  param(
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [float]$Radius
  )

  $diameter = $Radius * 2
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
  $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
  $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function Fill-RoundedRectangle {
  param(
    [System.Drawing.Graphics]$Graphics,
    [System.Drawing.Brush]$Brush,
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [float]$Radius
  )

  $path = New-RoundedRectanglePath -X $X -Y $Y -Width $Width -Height $Height -Radius $Radius
  $Graphics.FillPath($Brush, $path)
  $path.Dispose()
}

function Draw-RoundedRectangle {
  param(
    [System.Drawing.Graphics]$Graphics,
    [System.Drawing.Pen]$Pen,
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [float]$Radius
  )

  $path = New-RoundedRectanglePath -X $X -Y $Y -Width $Width -Height $Height -Radius $Radius
  $Graphics.DrawPath($Pen, $path)
  $path.Dispose()
}

function Draw-Chip {
  param(
    [System.Drawing.Graphics]$Graphics,
    [string]$Text,
    [float]$X,
    [float]$Y,
    [System.Drawing.Font]$Font
  )

  $size = $Graphics.MeasureString($Text, $Font)
  $width = [Math]::Ceiling($size.Width + 28)
  $height = 38
  $fill = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(42, 31, 185, 227))
  $border = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(75, 92, 225, 255), 1.5)
  $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 222, 248, 255))

  Fill-RoundedRectangle -Graphics $Graphics -Brush $fill -X $X -Y $Y -Width $width -Height $height -Radius 18
  Draw-RoundedRectangle -Graphics $Graphics -Pen $border -X $X -Y $Y -Width $width -Height $height -Radius 18
  $Graphics.DrawString($Text, $Font, $textBrush, $X + 14, $Y + 8)

  $fill.Dispose()
  $border.Dispose()
  $textBrush.Dispose()

  return $width
}

$width = 1280
$height = 640
$bitmap = New-Object System.Drawing.Bitmap($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)

$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

$backgroundRect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$backgroundBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  $backgroundRect,
  [System.Drawing.Color]::FromArgb(255, 4, 12, 23),
  [System.Drawing.Color]::FromArgb(255, 8, 32, 58),
  22
)
$graphics.FillRectangle($backgroundBrush, $backgroundRect)

$gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(20, 148, 163, 184), 1)
for ($x = 0; $x -le $width; $x += 80) {
  $graphics.DrawLine($gridPen, $x, 0, $x, $height)
}
for ($y = 0; $y -le $height; $y += 80) {
  $graphics.DrawLine($gridPen, 0, $y, $width, $y)
}

$glowA = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(36, 56, 189, 248))
$glowB = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(42, 34, 211, 238))
$graphics.FillEllipse($glowA, 720, -60, 540, 540)
$graphics.FillEllipse($glowB, 840, 120, 300, 300)
$graphics.FillEllipse($glowB, -140, 330, 380, 380)

$panelFill = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(138, 8, 18, 34))
$panelStroke = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(65, 94, 234, 255), 1.5)

Fill-RoundedRectangle -Graphics $graphics -Brush $panelFill -X 54 -Y 52 -Width 560 -Height 536 -Radius 34
Draw-RoundedRectangle -Graphics $graphics -Pen $panelStroke -X 54 -Y 52 -Width 560 -Height 536 -Radius 34

Fill-RoundedRectangle -Graphics $graphics -Brush $panelFill -X 654 -Y 72 -Width 572 -Height 496 -Radius 34
Draw-RoundedRectangle -Graphics $graphics -Pen $panelStroke -X 654 -Y 72 -Width 572 -Height 496 -Radius 34

$eyebrowFont = New-Object System.Drawing.Font("Segoe UI", 14, [System.Drawing.FontStyle]::Bold)
$titleFont = New-Object System.Drawing.Font("Segoe UI Semibold", 46, [System.Drawing.FontStyle]::Bold)
$bodyFont = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Regular)
$bodyFontCompact = New-Object System.Drawing.Font("Segoe UI", 17, [System.Drawing.FontStyle]::Regular)
$chipFont = New-Object System.Drawing.Font("Segoe UI Semibold", 13, [System.Drawing.FontStyle]::Bold)
$cardTitleFont = New-Object System.Drawing.Font("Segoe UI Semibold", 28, [System.Drawing.FontStyle]::Bold)
$metricFont = New-Object System.Drawing.Font("Segoe UI Semibold", 24, [System.Drawing.FontStyle]::Bold)
$smallFont = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Regular)

$cyanBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 156, 247, 255))
$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 242, 248, 255))
$mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 160, 178, 197))
$accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 110, 231, 255))

$graphics.DrawString("ASTROLOGICAL WORLDLINE ENGINE", $eyebrowFont, $cyanBrush, 84, 92)
$graphics.DrawString("Astrological", $titleFont, $whiteBrush, 82, 138)
$graphics.DrawString("Decision Simulator", $titleFont, $whiteBrush, 82, 194)

$subtitleRect = [System.Drawing.RectangleF]::new(84, 272, 480, 120)
$graphics.DrawString(
  "Map symbolic signals. Simulate 100 worldlines. Turn uncertainty into action.",
  $bodyFont,
  $mutedBrush,
  $subtitleRect
)

$chipX = 84
$chipX += Draw-Chip -Graphics $graphics -Text "Signals" -X $chipX -Y 380 -Font $chipFont
$chipX += 12
$chipX += Draw-Chip -Graphics $graphics -Text "Worldlines" -X $chipX -Y 380 -Font $chipFont
$chipX += 12
[void](Draw-Chip -Graphics $graphics -Text "Replay" -X $chipX -Y 380 -Font $chipFont)

$loopCards = @(
  @{ X = 84;  Title = "Assess";   Body = "signals" },
  @{ X = 256; Title = "Simulate"; Body = "branches" },
  @{ X = 428; Title = "Act";      Body = "timing" }
)

foreach ($card in $loopCards) {
  $fill = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(88, 13, 24, 42))
  $stroke = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(56, 124, 216, 255), 1.2)
  Fill-RoundedRectangle -Graphics $graphics -Brush $fill -X $card.X -Y 454 -Width 152 -Height 94 -Radius 22
  Draw-RoundedRectangle -Graphics $graphics -Pen $stroke -X $card.X -Y 454 -Width 152 -Height 94 -Radius 22
  $graphics.DrawString($card.Title, $metricFont, $whiteBrush, $card.X + 18, 474)
  $cardRect = [System.Drawing.RectangleF]::new([float]($card.X + 18), 510, 118, 32)
  $graphics.DrawString($card.Body, $smallFont, $mutedBrush, $cardRect)
  $fill.Dispose()
  $stroke.Dispose()
}

$graphics.DrawString("100 Astrological Worldlines", $cardTitleFont, $whiteBrush, 686, 110)
$summaryRect = [System.Drawing.RectangleF]::new(686, 152, 470, 60)
$graphics.DrawString("Symbolic branching. Replayable timing paths.", $bodyFontCompact, $mutedBrush, $summaryRect)

$metricCards = @(
  @{ X = 686; Value = "100"; Label = "worldlines" },
  @{ X = 858; Value = "12"; Label = "phases" },
  @{ X = 1030; Value = "5"; Label = "layers" }
)

foreach ($metric in $metricCards) {
  $fill = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(80, 14, 28, 48))
  $stroke = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(52, 114, 224, 255), 1.1)
  Fill-RoundedRectangle -Graphics $graphics -Brush $fill -X $metric.X -Y 226 -Width 150 -Height 110 -Radius 24
  Draw-RoundedRectangle -Graphics $graphics -Pen $stroke -X $metric.X -Y 226 -Width 150 -Height 110 -Radius 24
  $graphics.DrawString($metric.Value, $metricFont, $whiteBrush, $metric.X + 16, 248)
  $metricRect = [System.Drawing.RectangleF]::new([float]($metric.X + 16), 288, 120, 34)
  $graphics.DrawString($metric.Label, $smallFont, $mutedBrush, $metricRect)
  $fill.Dispose()
  $stroke.Dispose()
}

$chartFill = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(62, 11, 20, 37))
$chartStroke = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(48, 114, 224, 255), 1.0)
Fill-RoundedRectangle -Graphics $graphics -Brush $chartFill -X 686 -Y 360 -Width 344 -Height 168 -Radius 26
Draw-RoundedRectangle -Graphics $graphics -Pen $chartStroke -X 686 -Y 360 -Width 344 -Height 168 -Radius 26
$graphics.DrawString("Path divergence", $eyebrowFont, $cyanBrush, 708, 382)

$linePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 104, 234, 255), 4)
$linePoints = @(
  ([System.Drawing.PointF]::new(720, 476)),
  ([System.Drawing.PointF]::new(770, 446)),
  ([System.Drawing.PointF]::new(820, 430)),
  ([System.Drawing.PointF]::new(870, 412)),
  ([System.Drawing.PointF]::new(920, 392)),
  ([System.Drawing.PointF]::new(970, 366)),
  ([System.Drawing.PointF]::new(1020, 346))
)
$graphics.DrawLines($linePen, $linePoints)

foreach ($point in $linePoints) {
  $graphics.FillEllipse($accentBrush, $point.X - 5, $point.Y - 5, 10, 10)
}

$judgeFill = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(80, 14, 28, 48))
$judgeStroke = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(52, 114, 224, 255), 1.1)
Fill-RoundedRectangle -Graphics $graphics -Brush $judgeFill -X 1048 -Y 360 -Width 148 -Height 168 -Radius 26
Draw-RoundedRectangle -Graphics $graphics -Pen $judgeStroke -X 1048 -Y 360 -Width 148 -Height 168 -Radius 26
$graphics.DrawString("Judge verdict", $eyebrowFont, $cyanBrush, 1068, 382)
$judgeHeadlineRect = [System.Drawing.RectangleF]::new(1068, 420, 110, 36)
$judgeBodyRect = [System.Drawing.RectangleF]::new(1068, 458, 110, 54)
$graphics.DrawString("Wait, don't rush.", $smallFont, $whiteBrush, $judgeHeadlineRect)
$graphics.DrawString("Ask the next chart question first", $smallFont, $mutedBrush, $judgeBodyRect)

$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$judgeFill.Dispose()
$judgeStroke.Dispose()
$linePen.Dispose()
$chartFill.Dispose()
$chartStroke.Dispose()
$gridPen.Dispose()
$backgroundBrush.Dispose()
$panelFill.Dispose()
$panelStroke.Dispose()
$glowA.Dispose()
$glowB.Dispose()
$eyebrowFont.Dispose()
$titleFont.Dispose()
$bodyFont.Dispose()
$bodyFontCompact.Dispose()
$chipFont.Dispose()
$cardTitleFont.Dispose()
$metricFont.Dispose()
$smallFont.Dispose()
$cyanBrush.Dispose()
$whiteBrush.Dispose()
$mutedBrush.Dispose()
$accentBrush.Dispose()
$graphics.Dispose()
$bitmap.Dispose()

Write-Output "Generated $outputPath"
