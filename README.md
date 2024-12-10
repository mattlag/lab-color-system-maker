# Lab Color System Maker

This tool helps you define a color system, comprised of multiple color gradients with a base hue and saturation. Each color gradient has the same number of steps. The core ability is to be able to fiddle with the lightness of each step until it looks right, or matches another calculated lightness value.

How lightness is calculated for a given RGB color varies greatly depending on what color space you are using. In addition to controls for adjusting a RGB color (using HSL values), the tool also shows you the lightness of that color from the sRGB and LAB color spaces.

Clicking anywhere on the gradient row will toggle the controls for each gradient and gradient step. If you hold down the `Shift` key while adjusting the color, the number will be adjusted by 10 instead of 1.

Once the gradients looks good, they are converted to CSS Variables and a JSON object, for easy copy/pasting into a web project.


## Color spaces

### HSL and RGB
The HSL and RGB color spaces basically make no corrections to how lightness is calculated as hues and saturations change. 

Fully saturated Blue `hsl(240, 100%, 50%)` or `rgb(0, 0, 255)` and fully saturated Yellow `hsl(60, 100%, 50%)` or `rgb(255, 255, 0)` are said to have the same lightness in this color space. But, when you look at these with your eyes, the yellow appears much lighter than the blue.

This is the main downside to creating a gradient using straight hsl values - gradients of different hues will appear wildly mismatched at a given step.

### sRGB

sRGB is slightly better, applying a simple formula to RGB values to account for different hues and their perceived lightness.

Notably, this is the formula that WebAIM uses to calculate the contrast between to colors in it's Contrast Checker for web colors. 
https://webaim.org/resources/contrastchecker/

### Lab

Lab (aka CIELAB or L\*a\*b\* if you want to be technical) is an entirely different color space where colors are organized based on how humans perceive color. There have been many variations, and mostly this color space has been defined from test results using printed colors as opposed to screen colors... but, when HSL colors are mapped to the Lab color space, the lightness values seem to make the most sense.
https://en.wikipedia.org/wiki/CIELAB_color_space