export const verticalLinePlugin = {
    id: "verticalLine",
    afterDraw: (chart: any) => {
        if (chart.tooltip?._active && chart.tooltip?._active.length) {
            const ctx = chart.ctx;
            const x = chart.tooltip._active[0].element.x;
            const topY = chart.scales.y.top;
            const bottomY = chart.scales.y.bottom;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
            ctx.stroke();
            ctx.restore();
        }
    },
};