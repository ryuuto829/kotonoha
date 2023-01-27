/**
 * Get start coordinates of the kanji stroke
 * @param svgPath String of coordinates from svg `<path d="svgPath">`
 * @returns `{cx, cy}` XY Coordinates
 */
export function getStrokeCoordinatesFromSVGPath(svgPath: string) {
  const tokens = svgPath.split(',')
  const cx = tokens[0].split('M')[1]
  const cy = tokens[1].split('c')[0]

  return { cx, cy }
}
