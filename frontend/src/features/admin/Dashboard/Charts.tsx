import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { adminApi } from "../../../api/admin";

interface ChartData {
  date: string;
  reservations: number;
  revenue: number;
}

export const Charts: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await adminApi.getStats();
        renderChart(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };
    fetchData();
  }, []);

  const renderChart = (data: ChartData[]) => {
    if (!svgRef.current) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.date))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d: { reservations: any; }) => d.reservations) || 0])
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d: { date: any; }) => x(d.date) || 0)
      .attr("y", (d: { reservations: any; }) => y(d.reservations))
      .attr("width", x.bandwidth())
      .attr("height", (d: { reservations: any; }) => height - y(d.reservations))
      .attr("fill", "steelblue");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Évolution des réservations
      </h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};