import { useEffect, useRef } from "react";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const MAX_BARS = 20;

export default function D3NoteVisual() {
    const svgRef = useRef(null);
    const dataRef = useRef([]);

    // Trigger on note events
    useEffect(() => {
        const handleD3Data = (event) => {
            const latest = Array.isArray(event.detail) ? event.detail.at(-1) : event.detail;
            if (!latest) return;

            const note = String(latest.note ?? latest.n ?? "Err");
            const duration = latest.duration ?? latest.d ?? 0.25;


            const minDur = 0.05;
            const maxDur = 2.0;
            const normalized = Math.max(0.1, Math.min(1, (duration - minDur) / (maxDur - minDur)));
            const value = 0.3 + normalized * 0.7;

            // create new node object on node event
            const newNote = {
                id: `${Date.now()}-${Math.random()}`,
                note,
                value,
                duration,
                age: 0,
                maxAge: duration * 6,
                color: `hsl(${Math.random() * 360}, 95%, 65%)`,
            };

            dataRef.current = [...dataRef.current, newNote].slice(-MAX_BARS);
        };

        document.addEventListener("d3Data", handleD3Data);

        return () => document.removeEventListener("d3Data", handleD3Data);
    }, []);

    // Render loop
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const width = 1200;
        const height = 180;
        const barWidth = 50;
        const spacing = 10;
        const totalWidth = MAX_BARS * (barWidth + spacing);

        const render = () => {
            // Update bar age and remove expired bar
            dataRef.current = dataRef.current
                .map(d => ({ ...d, age: d.age + 0.016 }))
                .filter(d => d.age < d.maxAge);

            const bars = svg.selectAll(".bar")
                .data(dataRef.current, d => d.id);

            // Remove exited bar
            bars.exit().remove();

            // Add new bar
            const enter = bars.enter()
                .append("g")
                .attr("class", "bar");

            enter.append("rect").attr("class", "fill");

            // Transform bar position
            bars.merge(enter)
                .attr("transform", (d, i) => {
                    const x = width / 2 - totalWidth / 2 + i * (barWidth + spacing);
                    return `translate(${x}, 0)`;
                });

            const maxHeight = height - 50;

            // Glowing fill bars only
            bars.select(".fill")
                .attr("x", 6)
                .attr("y", d => height - maxHeight * (1 - d.age / d.maxAge) * d.value)
                .attr("width", barWidth - 12)
                .attr("height", d => Math.max(2, maxHeight * (1 - d.age / d.maxAge) * d.value))
                // .attr("rx", 10)
                .attr("fill", d => d.color)
                .attr("opacity", d => Math.max(0.5, 1 - d.age / d.maxAge * 0.85))
                .style("filter", "blur(1px)") // subtle glow
                .style("box-shadow", "0 0 12px rgba(255,255,255,0.6)");

            requestAnimationFrame(render);
        };

        render();
    }, []);

    return (
        <div style={{
            width: "100%",
            background: "#000000ff",
            padding: "30px 0",
            borderRadius: "16px",
            overflow: "hidden",
        }}>
            <svg
                ref={svgRef}
                width="100%"
                height="180"
                viewBox="0 0 1200 180"
                preserveAspectRatio="xMidYMid meet"
                style={{ background: "#000000ff" }}
            />
        </div>
    );
}