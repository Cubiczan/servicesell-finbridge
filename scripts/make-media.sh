#!/usr/bin/env bash
# Compose YouTube thumbnail + ~180s H.264 demo from live product screenshots.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MEDIA="$ROOT/docs/media"
WORK="$MEDIA/_work"
ART="$ROOT/artifacts"
FONT_B="/usr/share/fonts/truetype/macos/Inter-Bold.ttf"
FONT_R="/usr/share/fonts/truetype/macos/Inter-Regular.ttf"
FONT_M="/usr/share/fonts/truetype/macos/Inter-Medium.ttf"

mkdir -p "$WORK" "$ART"

draw() {
  local infile="$1" outfile="$2" title="$3" sub="$4"
  ffmpeg -y -hide_banner -loglevel error \
    -i "$infile" \
    -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=0x10110F,drawbox=x=0:y=640:w=1280:h=80:color=black@0.62:t=fill,drawtext=fontfile=${FONT_B}:text='${title}':fontcolor=white:fontsize=26:x=36:y=656,drawtext=fontfile=${FONT_R}:text='${sub}':fontcolor=0xE8D9B0:fontsize=18:x=36:y=688" \
    -frames:v 1 "$outfile"
}

cat > "$WORK/thumb.fc" <<EOF
[0][1]hstack=inputs=2[base];
[base]drawbox=x=636:y=0:w=8:h=720:color=0xC9A227@1:t=fill[split];
[split]drawtext=fontfile=${FONT_B}:text='ServiceSell':fontcolor=0xF4F1EA:fontsize=36:x=80:y=250,drawtext=fontfile=${FONT_R}:text='Field-workflow agents':fontcolor=0xD97706:fontsize=20:x=80:y=304,drawtext=fontfile=${FONT_B}:text='FinBridge':fontcolor=0xE8EEF8:fontsize=36:x=720:y=250,drawtext=fontfile=${FONT_R}:text='Shop-floor finance-ops':fontcolor=0xC9A227:fontsize=20:x=720:y=304,drawtext=fontfile=${FONT_B}:text='ServiceSell  |  FinBridge':fontcolor=white:fontsize=44:x=(w-text_w)/2:y=80,drawtext=fontfile=${FONT_M}:text='AI agents in the blue-collar workflow':fontcolor=0xC9A227:fontsize=26:x=(w-text_w)/2:y=140,drawtext=fontfile=${FONT_R}:text='Propose  ->  Challenge  ->  Lock':fontcolor=0xF4F1EA:fontsize=22:x=(w-text_w)/2:y=580,drawtext=fontfile=${FONT_R}:text='cubiczan.com   |   Cubiczan CHP':fontcolor=0x9AA8C2:fontsize=16:x=(w-text_w)/2:y=630
EOF

ffmpeg -y -hide_banner -loglevel error \
  -f lavfi -i "color=c=0x171914:s=640x720:d=1" \
  -f lavfi -i "color=c=0x0B1220:s=640x720:d=1" \
  -filter_complex_script "$WORK/thumb.fc" \
  -frames:v 1 "$MEDIA/thumbnail.png"

ffmpeg -y -hide_banner -loglevel error -f lavfi -i "color=c=0x10110F:s=1280x720:d=1" \
  -vf "drawtext=fontfile=${FONT_B}:text='ServiceSell  |  FinBridge':fontcolor=white:fontsize=52:x=(w-text_w)/2:y=250,drawtext=fontfile=${FONT_M}:text='AI agents in the blue-collar workflow':fontcolor=0xC9A227:fontsize=28:x=(w-text_w)/2:y=330,drawtext=fontfile=${FONT_R}:text='One product  |  two skins  |  governed CHP lock':fontcolor=0xB7B2A6:fontsize=22:x=(w-text_w)/2:y=400" \
  -frames:v 1 "$WORK/card-title.png"

ffmpeg -y -hide_banner -loglevel error -f lavfi -i "color=c=0x0B1220:s=1280x720:d=1" \
  -vf "drawtext=fontfile=${FONT_B}:text='Lock the agent. Then export.':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=250,drawtext=fontfile=${FONT_R}:text='cubiczan.com  |  propose -> challenge -> lock':fontcolor=0xC9A227:fontsize=24:x=(w-text_w)/2:y=330,drawtext=fontfile=${FONT_R}:text='Production governed agents. Not a demo pitch.':fontcolor=0x9AA8C2:fontsize=20:x=(w-text_w)/2:y=390,drawtext=fontfile=${FONT_R}:text='Illustrative composites only  |  MIT':fontcolor=0x9AA8C2:fontsize=18:x=(w-text_w)/2:y=460" \
  -frames:v 1 "$WORK/card-end.png"

draw "$MEDIA/01-brand-gate.png" "$WORK/s01.png" "One product. Two skins." "Pick ServiceSell or FinBridge - same ability underneath."
draw "$MEDIA/02-servicesell-ingest.png" "$WORK/s02.png" "ServiceSell - ingest" "Illustrative HVAC composite. Not a customer."
draw "$MEDIA/03-servicesell-workup.png" "$WORK/s03.png" "Propose the field-workflow pack" "Dispatch, after-hours, quoting, job-cost."
draw "$MEDIA/04-servicesell-challenge.png" "$WORK/s04.png" "Challenge the weak claims" "Missed after-hours, open quotes, job-cost leakage."
draw "$MEDIA/05-servicesell-review.png" "$WORK/s05.png" "Human review is the lock" "Approve or reject every claim. Pending blocks export."
draw "$MEDIA/06-servicesell-export.png" "$WORK/s06.png" "Export the workflow pack" "Markdown + JSON of locked claims only."
draw "$MEDIA/07-finbridge-ingest.png" "$WORK/s07.png" "Switch to FinBridge" "Same engine. Shop-floor quoting, job-cost, cash."
draw "$MEDIA/08-finbridge-proforma.png" "$WORK/s08.png" "Forward operating view" "Job-cost and cash agents beyond the bookkeeper."
draw "$MEDIA/09-finbridge-challenge.png" "$WORK/s09.png" "Same CHP spine" "FinBridge challenges still require a human lock."
draw "$MEDIA/10-mobile-servicesell.png" "$WORK/s10.png" "ServiceSell on mobile" "Stacked CHP rail + ingest form."
draw "$MEDIA/11-mobile-finbridge.png" "$WORK/s11.png" "FinBridge on mobile" "One product. Two skins. Phone-width."

simple_still() {
  local src="$1" dest="$2" secs="$3"
  ffmpeg -y -hide_banner -loglevel error -loop 1 -i "$src" -t "$secs" \
    -vf "fps=30,format=yuv420p" \
    -c:v libx264 -preset veryfast -crf 26 -pix_fmt yuv420p -r 30 "$dest"
}

simple_still "$WORK/card-title.png" "$WORK/c00.mp4" 10
simple_still "$WORK/s01.png" "$WORK/c01.mp4" 15
simple_still "$WORK/s02.png" "$WORK/c02.mp4" 16
simple_still "$WORK/s03.png" "$WORK/c03.mp4" 18
simple_still "$WORK/s04.png" "$WORK/c04.mp4" 16
simple_still "$WORK/s05.png" "$WORK/c05.mp4" 14
simple_still "$WORK/s06.png" "$WORK/c06.mp4" 14
simple_still "$WORK/s07.png" "$WORK/c07.mp4" 15
simple_still "$WORK/s08.png" "$WORK/c08.mp4" 18
simple_still "$WORK/s09.png" "$WORK/c09.mp4" 14
simple_still "$WORK/s10.png" "$WORK/c10.mp4" 10
simple_still "$WORK/s11.png" "$WORK/c11.mp4" 8
simple_still "$WORK/card-end.png" "$WORK/c12.mp4" 12

list="$WORK/concat.txt"
: > "$list"
for i in 00 01 02 03 04 05 06 07 08 09 10 11 12; do
  echo "file '$WORK/c${i}.mp4'" >> "$list"
done

ffmpeg -y -hide_banner -loglevel error -f concat -safe 0 -i "$list" \
  -c:v libx264 -preset medium -crf 26 -pix_fmt yuv420p -movflags +faststart \
  "$MEDIA/demo.mp4"

cp -f "$MEDIA/thumbnail.png" "$ART/thumbnail.png"
cp -f "$MEDIA/demo.mp4" "$ART/demo.mp4"
cp -f "$MEDIA/01-brand-gate.png" "$ART/screenshot_brand_gate.png"
cp -f "$MEDIA/03-servicesell-workup.png" "$ART/screenshot_servicesell_workup.png"
cp -f "$MEDIA/04-servicesell-challenge.png" "$ART/screenshot_servicesell_challenge.png"
cp -f "$MEDIA/08-finbridge-proforma.png" "$ART/screenshot_finbridge_proforma.png"

rm -f "$WORK"/c*.mp4 "$WORK/concat.txt" "$WORK/thumb.fc"

ffprobe -v error -show_entries format=duration,size -of default=nw=1 "$MEDIA/demo.mp4"
file "$MEDIA/thumbnail.png"
ls -lh "$MEDIA/demo.mp4" "$MEDIA/thumbnail.png"
echo "media ready"
