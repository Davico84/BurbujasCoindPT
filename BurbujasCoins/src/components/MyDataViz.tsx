import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";
import monedas from "../data/monedas.json";

const BubbleChart: React.FC = () => {
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Eliminar cualquier elemento SVG existente antes de crear uno nuevo
    d3.select(ref.current).selectAll("*").remove();

    const width = 800;
    const height = 600;

    // Filtrar datos
    const filteredData = monedas;

    const color = (d: any) =>
      d.price_change_percentage_24h > 0 ? "#30E000" : "rgb(190, 23, 23)";

    const size = d3
      .scaleLinear()
      .domain(d3.extent(filteredData, (d) => d.price_change_percentage_24h))
      .range([7, 40]);

    // Crear el contenedor SVG
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("border", "2px solid blue")
      .style("background-color", "lightgray");

    // Crear círculos
    let node = svg
      .append("g")
      .selectAll("circle")
      .data(filteredData)
      .join("circle")
      .attr("class", "node")
      .attr("r", (d: any) => size(d.price_change_percentage_24h))
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .style("fill", (d: any) => d3.color(color(d)).brighter(2))
      .style("fill-opacity", 0.6)
      .attr("stroke", color)
      .style("stroke-width", 3)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this)
          .style("filter", "drop-shadow(0 0 10px black)");
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .style("filter", "none");
      })
      .on("click", (event, d) => {
        console.log("ID:", d.id);
        // Navegar al componente GraphbyDay con el id de la moneda como parámetro
        navigate(`/graph/${d.id}`);
      })
      .call(
        d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    // Crear imágenes
    let scaleFactor = 0.9;
    let images = svg
      .append("g")
      .selectAll("image")
      .data(filteredData)
      .join("image")
      .attr("class", "image")
      .attr("xlink:href", (d: any) => d.image)
      .attr("x", (d: any) => d.x - (size(d.price_change_percentage_24h) * scaleFactor) / 2)
      .attr("y", (d: any) => d.y - (size(d.price_change_percentage_24h) * scaleFactor) / 2 - 20)
      .attr("height", (d: any) => size(d.price_change_percentage_24h) * scaleFactor)
      .attr("width", (d: any) => size(d.price_change_percentage_24h) * scaleFactor);

    // Crear texto para los símbolos
    const fontSizeScale = d3
      .scaleLinear()
      .domain(d3.extent(filteredData, (d) => d.price_change_percentage_24h))
      .range([4, 12]);

    let textSymbol = svg
      .append("g")
      .selectAll("text")
      .data(filteredData)
      .join("text")
      .attr("class", "label")
      .attr("dy", "+1.1em")
      .attr("text-anchor", "middle")
      .text((d: any) => d.symbol)
      .style("font-size", (d: any) => `${fontSizeScale(d.price_change_percentage_24h)}px`)
      .style("font-weight", "bold")
      .style("fill", "white")
      .style("pointer-events", "none");

    // Crear texto para los porcentajes
    let textPercentage = svg
      .append("g")
      .selectAll("text")
      .data(filteredData)
      .join("text")
      .attr("class", "label")
      .attr("dy", "2.25em")
      .attr("text-anchor", "middle")
      .text((d: any) => `${d.price_change_percentage_24h}%`)
      .style("font-size", (d: any) => `${fontSizeScale(d.price_change_percentage_24h)}px`)
      .style("fill", "white")
      .style("pointer-events", "none");

    // Crear simulación
    const simulation = d3
      .forceSimulation(filteredData)
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(5))
      .force("collide", d3.forceCollide()
        .strength(0.7)
        .radius((d: any) => size(d.price_change_percentage_24h) + 3)
        .iterations(1))
      .force("x", d3.forceX().x((d: any) => Math.max(size(d.price_change_percentage_24h), Math.min(width - size(d.price_change_percentage_24h), d.x))))
      .force("y", d3.forceY().y((d: any) => Math.max(size(d.price_change_percentage_24h), Math.min(height - size(d.price_change_percentage_24h), d.y))))
      .on("tick", () => {
        node
          .attr("cx", (d: any) => (d.x = Math.max(size(d.price_change_percentage_24h), Math.min(width - size(d.price_change_percentage_24h), d.x))))
          .attr("cy", (d: any) => (d.y = Math.max(size(d.price_change_percentage_24h), Math.min(height - size(d.price_change_percentage_24h), d.y))));

        images
          .attr("x", (d: any) => d.x - (size(d.price_change_percentage_24h) * scaleFactor) / 2)
          .attr("y", (d: any) => d.y - (size(d.price_change_percentage_24h) * scaleFactor) / 2 - 11);

        textSymbol
          .attr("x", (d: any) => d.x)
          .attr("y", (d: any) => d.y);

        textPercentage
          .attr("x", (d: any) => d.x)
          .attr("y", (d: any) => d.y);
      });

    // Funciones de arrastre
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.03).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.03);
      d.fx = null;
      d.fy = null;
    }
  }, []);

  return <div ref={ref}></div>;
};

export default BubbleChart;
