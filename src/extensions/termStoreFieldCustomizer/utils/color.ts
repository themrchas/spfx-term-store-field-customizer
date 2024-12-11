export function stringToColour(str: string) : string{
    let hash: number = 0;
    for (let i:number = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour : string= '#';
    for (let i:number = 0; i < 3; i++) {
        let value: number = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }

    return colour;
}

export function fontColorFromBackground(hexColor): string {
   // let r = 0, g = 0, b = 0;
   let r:string = "0", 
   g: string = "0", 
   b: string = "0";

    // 3 digits
    if (hexColor.length == 4) {
        r = "0x" + hexColor[1] + hexColor[1];
        g = "0x" + hexColor[2] + hexColor[2];
        b = "0x" + hexColor[3] + hexColor[3];
    // 6 digits
    } else if (hexColor.length == 7) {
        r = "0x" + hexColor[1] + hexColor[2];
        g = "0x" + hexColor[3] + hexColor[4];
        b = "0x" + hexColor[5] + hexColor[6];
    }

    // http://www.w3.org/TR/AERT#color-contrast
    const brightness: number = Math.round(((parseInt(r) * 299) +
                        (parseInt(g) * 587) +
                        (parseInt(b) * 114)) / 1000);

    return (brightness > 125) ? 'black' : 'white';
};