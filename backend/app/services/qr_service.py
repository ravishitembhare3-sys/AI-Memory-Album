import os
import qrcode

QR_FOLDER = "app/qr_codes"

os.makedirs(QR_FOLDER, exist_ok=True)


def generate_qr(album_code: str):

    url = f"http://localhost:5173/public/{album_code}"

    qr = qrcode.QRCode(
        version=1,
        box_size=10,
        border=2
    )

    qr.add_data(url)
    qr.make(fit=True)

    image = qr.make_image(fill_color="black", back_color="white")

    filename = f"{album_code}.png"

    path = os.path.join(QR_FOLDER, filename)

    image.save(path)

    return filename