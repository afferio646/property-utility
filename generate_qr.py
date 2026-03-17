import qrcode

data = "https://afferio646-property-utility.vercel.app"
img = qrcode.make(data)
img.save("public/mobile-preview-qr.png")
