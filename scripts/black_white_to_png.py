# This script converts a black and white image to a PNG image with
# transparency based on the brightness of the pixels.
#
# Perfect for converting black and white icons into watermarks
import sys
from PIL import Image


def convert_to_opacity_based_on_brightness(image_path, output_path):
    img = Image.open(image_path).convert("RGBA")

    pixels = img.load()
    for i in range(img.width):
        for j in range(img.height):
            r, g, b, a = pixels[i, j]

            brightness = (r + g + b) // 3
            result_alpha = 256 - brightness
            if result_alpha <= 10:
                result_alpha = 0

            pixels[i, j] = (0, 0, 0, result_alpha)

    # Salva a imagem resultante
    img.save(output_path)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python script.py <input_image_path> <output_image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    output_path = sys.argv[2]
    convert_to_opacity_based_on_brightness(image_path, output_path)
