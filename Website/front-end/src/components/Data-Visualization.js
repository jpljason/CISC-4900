import React, { useState, useEffect } from "react";
import "../styles/data-visualization.css"
import {Chart as ChartJS } from "chart.js/auto"
import { Line, Bar, Pie, Doughnut, Radar, PolarArea, Bubble, Scatter } from 'react-chartjs-2';
import crashes_data_visualization from "../data/crashes_data_visualization"

export default function DataVisualization() {
  const Chart = () => {
    return (
      <div className="charts-graphs-container">
        <div className="chart-graph">
          <Bar //can change to <Doughnut <Line <Bar ***NEVER DO <Chart because crash
            data={{
              labels: ['2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023'],
              datasets: [
                {
                  label: "Number of Crashes",
                  data: [         
                    crashes_data_visualization[2013].total_crashes,
                    crashes_data_visualization[2014].total_crashes,
                    crashes_data_visualization[2015].total_crashes,
                    crashes_data_visualization[2016].total_crashes,
                    crashes_data_visualization[2017].total_crashes,
                    crashes_data_visualization[2018].total_crashes,
                    crashes_data_visualization[2019].total_crashes,
                    crashes_data_visualization[2020].total_crashes,
                    crashes_data_visualization[2021].total_crashes,
                    crashes_data_visualization[2022].total_crashes,
                    crashes_data_visualization[2023].total_crashes,
                  ],
                  backgroundColor: 'lightblue',
                  borderColor: 'blue',
                  borderWidth: 1,
                  borderRadius: 3,
                }
              ],
            }}
            options={{
              aspectRatio: 1,
              scales: {
                y: {
                  beginAtZero: true
                }
              },
              plugins: {
                title: {
                  display: true,
                  text: "Number of Crashes by Year in NYC"
                }
              }
            }}
          />
        </div>

        <div className="chart-graph">
          <Line //can change to <Doughnut <Line <Bar ***NEVER DO <Chart because crash
            data={{
              labels: ['2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023'],
              datasets: [
                {
                  label: "Number of Crashes",
                  data: [
                    crashes_data_visualization[2013].rush_hour_crashes / crashes_data_visualization[2013].total_crashes,
                    crashes_data_visualization[2014].rush_hour_crashes / crashes_data_visualization[2014].total_crashes,
                    crashes_data_visualization[2015].rush_hour_crashes / crashes_data_visualization[2015].total_crashes,
                    crashes_data_visualization[2016].rush_hour_crashes / crashes_data_visualization[2016].total_crashes,
                    crashes_data_visualization[2017].rush_hour_crashes / crashes_data_visualization[2017].total_crashes,
                    crashes_data_visualization[2018].rush_hour_crashes / crashes_data_visualization[2018].total_crashes,
                    crashes_data_visualization[2019].rush_hour_crashes / crashes_data_visualization[2019].total_crashes,
                    crashes_data_visualization[2020].rush_hour_crashes / crashes_data_visualization[2020].total_crashes,
                    crashes_data_visualization[2021].rush_hour_crashes / crashes_data_visualization[2021].total_crashes,
                    crashes_data_visualization[2022].rush_hour_crashes / crashes_data_visualization[2022].total_crashes,
                    crashes_data_visualization[2023].rush_hour_crashes / crashes_data_visualization[2023].total_crashes,
                  ],
                  backgroundColor: 'lightblue',
                  borderColor: 'blue',
                  borderWidth: 1,
                  borderRadius: 3,
                  pointBackgroundColor: 'lightblue',
                  pointBorderColor: 'blue',
                  pointRadius: 5,
                  pointHoverRadius: 8,
                  pointHoverBorderWidth: 3,
                }
              ],
            }}
            options={{
              aspectRatio: 1,
              scales: {
                y: {
                  beginAtZero: true
                }
              },
              plugins: {
                title: {
                  display: true,
                  text: 'Percentage of Crashes Occuring During Rush Hour in NYC',
                  font: {
                    size: 20,
                  }
                },
                legend: {
                  display: true,
                },
                tooltip: {
                  enabled: true,
                  callbacks: {
                    label: function(context) {
                      // const year = context.label;
                      // const value = context.raw; // Data point value
                      const percentage = crashes_data_visualization[2013].rush_hour_crashes / crashes_data_visualization[2013].total_crashes * 100;
                      const arr = [
                        crashes_data_visualization[2013].total_crashes
                      ];
                      // Customize message shown in the tooltip
                      return `Number of Crashes During Rush Hour: ${arr}`;
                      
                      // ${percentage.toFixed(3)}%`
                    },
                    // You can also add a custom title if desired
                    title: function(context) {
                      return "Crash Data Details"; // Optional: Custom title text
                    }
                  },
                }
              },
            }}
          />
        </div>

        <div className="chart-graph">
          <Line //can change to <Doughnut <Line <Bar ***NEVER DO <Chart because crash
            data={{
              labels: ['2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023'],
              datasets: [
                {
                  label: "Number of Crashes",
                  data: [
                    crashes_data_visualization[2013].rush_hour_crashes,
                    crashes_data_visualization[2014].rush_hour_crashes,
                    crashes_data_visualization[2015].rush_hour_crashes,
                    crashes_data_visualization[2016].rush_hour_crashes,
                    crashes_data_visualization[2017].rush_hour_crashes,
                    crashes_data_visualization[2018].rush_hour_crashes,
                    crashes_data_visualization[2019].rush_hour_crashes,
                    crashes_data_visualization[2020].rush_hour_crashes,
                    crashes_data_visualization[2021].rush_hour_crashes,
                    crashes_data_visualization[2022].rush_hour_crashes,
                    crashes_data_visualization[2023].rush_hour_crashes,
                  ],
                  backgroundColor: 'lightblue',
                  borderColor: 'blue',
                  borderWidth: 1,
                  borderRadius: 3,
                  pointBackgroundColor: 'lightblue',
                  pointBorderColor: 'blue',
                  pointRadius: 5,
                  pointHoverRadius: 8,
                  pointHoverBorderWidth: 3,
                  hoverBackgroundColor: 'yellow',
                }
              ],
            }}
            options={{
              aspectRatio: 1,
              scales: {
                y: {
                  beginAtZero: true
                }
              },
              plugins: {
                title: {
                  display: true,
                  text: "Percentage of Crashes Occuring During Rush Hour in NYC ",
                  // color: 'pink'
                }
              }
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <section className="charts_graphs_section">
      <Chart />
    </section>
  )
}