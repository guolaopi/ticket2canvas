import JsBarcode from "jsbarcode";
import QRcode from "qrcode";

// 绘制打印的文字
function cvsDrawText(items, ctx) {
    items.forEach((p) => {
        const fontSize = p.fontSize || 16;
        const fontFamily = p.fontFamily || "Microsoft YaHei";
        let fontStyle = `${fontSize}px ${fontFamily}`;
        if (p.bold) {
            fontStyle = "normal bold " + fontStyle; // 加粗
        }
        ctx.font = fontStyle;
        ctx.fillText(p.content, p.left, p.top + p.height * 0.8);
    });
}

//绘制打印的条形码和二维码
async function cvsDarwCodes(items, ctx) {
    const drawPromises = items.map(
        (p) =>
            new Promise((resolve) => {
                if (p.type == "barcode") {
                    // 绘制条形码，注意：此插件中的width指的不是码整体的width，而是每根线的width
                    const codeCvs = document.createElement("canvas");
                    JsBarcode(codeCvs, p.content, {
                        displayValue: false, // 不显示条形码下方的值
                        width: 3,
                        height: p.height - 10,
                        margin: 0,
                    });
                    const img = new Image();
                    img.src = codeCvs.toDataURL("image/png", 0.8);
                    img.onload = () => {
                        if (p.width && p.height) {
                            ctx.drawImage(img, p.left, p.top, 100, 100);
                        } else {
                            ctx.drawImage(
                                img,
                                p.left,
                                p.top,
                                p.width,
                                p.height
                            );
                        }
                        resolve(true);
                    };
                }
                if (p.type == "qrcode") {
                    const opt = { margin: 0, width: p.width };
                    QRcode.toDataURL(p.content, opt, (err, bs64) => {
                        if (err) {
                            console.error("paint qrcode error: ", err);
                        } else {
                            const img = new Image();
                            img.src = bs64;
                            img.onload = () => {
                                if (p.width && p.height) {
                                    ctx.drawImage(img, p.left, p.top, 100, 100);
                                } else {
                                    ctx.drawImage(
                                        img,
                                        p.left,
                                        p.top,
                                        p.width,
                                        p.height
                                    );
                                }
                                resolve(true);
                            };
                        }
                    });
                }
            })
    );
    await Promise.all(drawPromises); // 等待所有图片绘制结束
}

export default async function ticket2canvas(option) {
    const { el, json, showCanvas } = option;
    let cvs;
    if (!el) {
        cvs = document.createElement("canvas");
    } else {
        cvs = document.getElementById(el.replace("#", ""));
    }
    if (!cvs) {
        console.error("canvas element is undefined");
        return;
    }
    if (showCanvas) {
        document.body.appendChild(cvs);
    }
    cvs.width = json.width || 300;
    cvs.height = json.height || 600;
    const ctx = cvs.getContext("2d");
    const textList = json.list.filter((p) => p.type == "text");
    cvsDrawText(textList, ctx);

    const codeList = json.list.filter(
        (p) => p.type == "barcode" || p.type == "qrcode"
    );
    await cvsDarwCodes(codeList, ctx);

    const bs64 = cvs.toDataURL("image/png", 0.8); // 转换为base64字符串
    return bs64;
}
