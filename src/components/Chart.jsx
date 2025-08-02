import { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function Chart({ data }) {
  const ref = useRef();

  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) {
      d3.select(ref.current).html("<p style='color:red'>❌ داده معتبر نیست</p>");
      return;
    }

    d3.select(ref.current).selectAll("*").remove();

    const margin = { top: 20, right: 80, bottom: 30, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const timestamps = data.map((d) => d[0]);
    const values = data.map((d) => d[1]);

    const isMultiSeries = Array.isArray(values[0]);

    const x = d3.scaleLinear()
      .domain(d3.extent(timestamps))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([
        d3.min(isMultiSeries ? values.flat() : values, (v) => v !== null ? v : Infinity),
        d3.max(isMultiSeries ? values.flat() : values, (v) => v !== null ? v : -Infinity)
      ])
      .nice()
      .range([height, 0]);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    if (isMultiSeries) {
      const colors = ["blue", "green", "red"];
      const labels = ["Series 1", "Series 2", "Series 3"];

      values[0].forEach((_, seriesIndex) => {
        const line = d3.line()
          .defined((d) => d[1][seriesIndex] !== null)
          .x((d) => x(d[0]))
          .y((d) => y(d[1][seriesIndex]));

        svg.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", colors[seriesIndex])
          .attr("stroke-width", 2)
          .attr("d", line);
      });

      const legend = svg.append("g")
        .attr("transform", `translate(${width + 10}, 0)`);

      labels.forEach((label, i) => {
        const row = legend.append("g").attr("transform", `translate(0, ${i * 20})`);

        row.append("rect")
          .attr("width", 10)
          .attr("height", 10)
          .attr("fill", colors[i]);

        row.append("text")
          .attr("x", 15)
          .attr("y", 10)
          .attr("font-size", "12px")
          .text(label);
      });

    } else {
      const line = d3.line()
        .defined((d) => d[1] !== null)
        .x((d) => x(d[0]))
        .y((d) => y(d[1]));

      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);
    }
  }, [data]);

  return <div ref={ref}></div>;
}
