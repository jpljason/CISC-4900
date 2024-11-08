import React, { useState, useEffect, useRef } from "react";
import "../styles/data-visualization.css"
import {Chart as ChartJS, Colors } from "chart.js/auto"
import { Line, Bar, Pie, Doughnut, Radar, PolarArea, Bubble, Scatter } from 'react-chartjs-2';
import crashes_data_visualization from "../data/crashes_data_visualization.json"

// display total crashes for recent 12 year
const totalCrashes = (years) => years.map((year) => {
  return crashes_data_visualization[year].total_crashes;
})

// display rush hour crash percentages for recent 12 years
const rushHourCrashes = (years) => years.map((year) => {
  return crashes_data_visualization[year].rush_hour_crashes / crashes_data_visualization[year].total_crashes;
})

// display total number of people injured for recent 12 years
const totalInjured = (years) => years.map((year) => {
  return crashes_data_visualization[year].injured;
})

// display total number of people killed for recent 12 years
const totalKilled = (years) => years.map((year) => {
  return crashes_data_visualization[year].killed
})

// display number of people killed each borough for recent 12 years
const boroughsLabel = ['Brooklyn', 'Bronx', 'Queens', 'Manhattan', 'Staten Island']
const totalBoroughs = (years) => {
  const boroughCounts = [0, 0, 0, 0, 0];
  years.forEach((year) => {
    boroughCounts[0] += crashes_data_visualization[year].boroughs.brooklyn;
    boroughCounts[1] += crashes_data_visualization[year].boroughs.bronx;
    boroughCounts[2] += crashes_data_visualization[year].boroughs.queens;
    boroughCounts[3] += crashes_data_visualization[year].boroughs.manhattan;
    boroughCounts[4] += crashes_data_visualization[year].boroughs.staten_island;
  })
  return boroughCounts;
}

// display number of people injured for pedestrians, motorists, cyclists for recent 12 years
const pmcInjuredLabel = ["Pedestrians", "Motorists", "Cyclists"];
const pedestrianMotoristCyclistInjured = (years) => {
  const pmcInjuredCount = [0, 0, 0];
  years.forEach((year) => {
    const currentYear = crashes_data_visualization[year];
    pmcInjuredCount[0] += currentYear.pedestrians.injured;
    pmcInjuredCount[1] += currentYear.motorists.injured;
    pmcInjuredCount[2] += currentYear.cyclists.injured;
  })
  return pmcInjuredCount;
}

// display number of people killed for pedestrians, motorists, cyclists for recent 12 years
const pmcKilledLabel = ["Pedestrians", "Motorists", "Cyclists"];
const pedestrianMotoristCyclistKilled = (years) => {
  const pmcKilledCount = [0, 0, 0];
  years.forEach((year) => {
    const currentYear = crashes_data_visualization[year];
    pmcKilledCount[0] += currentYear.pedestrians.killed;
    pmcKilledCount[1] += currentYear.motorists.killed;
    pmcKilledCount[2] += currentYear.cyclists.killed;
  })
  return pmcKilledCount;
}

// bar displaying total number of crashes each year
const TotalCrashesChart = ({years}) => {
  const data = {
    labels: years,
    datasets: [
      {
        label: "Number of Crashes",
        data: totalCrashes(years),
        backgroundColor: 'blueviolet',
        borderColor: 'blueviolet',
        borderWidth: 1,
        borderRadius: 3,
      },
    ],
  };

  const options = {
    aspectRatio: 1,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Number of Crashes by Year in NYC",
        font: {
          size: 16,
        },
      },
    },
  };

  return (
      <Bar data={data} options={options} />
  )
}

// line graph displaying percentages of crashes during rush hour in each year
const RushHourPercentagesChart = ({years}) => {
  return (
    <Line //can change to <Doughnut <Line <Bar ***NEVER DO <Chart because crash
      data={{
        labels: years,
        datasets: [
          {
            label: "Number of Crashes",
            data: rushHourCrashes(years),
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
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return (value*100) + '%'; //Convert y-axis to percent format
              },
            },
            min: 0.3,
            max: 0.5, //1 = 100%
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Percentage of Crashes Occuring During Rush Hour in NYC',
            font: {
              size: 16,
            }
          },
          legend: {
            display: true,
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function(context) {  //context=when user hovers each bar/plot
                const year = context.label;
                // const percentage = crashes_data_visualization[2013].rush_hour_crashes / crashes_data_visualization[2013].total_crashes * 100;
                const rushHourCrashes = crashes_data_visualization[year].rush_hour_crashes;
                // Customize message shown in the tooltip
                return `Number of Crashes During Rush Hour: ${rushHourCrashes}`;
                
                // ${percentage.toFixed(3)}%`
              },
              // PROBABLY UNNECESSARY:
              // title: function(context) {
              //   return "Crash Data Details"; // Optional: Custom title text
              // }
            },
          }
        },
      }}
    />
  )
}

// bar graph displaying total number injured each year
const TotalInjuredChart = ({years}) => {
  return (
    <Bar //can change to <Doughnut <Line <Bar ***NEVER DO <Chart because crash
      data={{
        labels: years,
        datasets: [
          {
            label: "Number of People Injured",
            data: totalInjured(years),
            backgroundColor: 'rgb(255,70,50)',
            borderColor: 'rgb(255,70,50)',
            borderWidth: 1,
            borderRadius: 3,
            pointBackgroundColor: 'lightblue',
            pointBorderColor: 'blue',
            pointRadius: 5,
            pointHoverRadius: 8,
            pointHoverBorderWidth: 3,
            // hoverBackgroundColor: 'yellow',
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
            text: "Number of People Injured Each Year in NYC",
            font: {
              size: 16,
            }
            // color: 'pink'
          }
        }
      }}
    />
  )  
}

// bar graph displaying total number killed each year
const TotalKilledChart = ({years}) => {
  return (
    <Bar //can change to <Doughnut <Line <Bar ***NEVER DO <Chart because crash
      data={{
        labels: years,
        datasets: [
          {
            label: "Number of People Killed",
            data: totalKilled(years),
            backgroundColor: 'blueviolet',
            borderColor: 'blueviolet',
            borderWidth: 1,
            borderRadius: 3,
            pointBackgroundColor: 'lightcoral',
            pointBorderColor: 'red',
            pointRadius: 5,
            pointHoverRadius: 8,
            pointHoverBorderWidth: 3,
            // hoverBackgroundColor: 'orange',
          }
        ],
      }}
      options={{
        aspectRatio: 1,
        scales: {
          y: {
            type: 'linear',
            beginAtZero: true,
            title: {
              display: true,
            },
          }
        },
        plugins: {
          title: {
            display: true,
            text: "Number of People Killed Each Year in NYC",
            font: {
              size: 16,
            }
          }
        }
      }}
    />
  )
}

// pie graph displaying number of pedestrians/cyclists/motorists injured throughout the recent 12 years
const PedestriansMotoristsCyclistsInjuredChart = ({years, isCompare}) => {
  //data for Pie
  const pieData = {
    labels: pmcInjuredLabel,
    datasets: [
      {
        label: "Number of Injured",
        data: pedestrianMotoristCyclistInjured(years),
        backgroundColor: ['rgb(28, 28, 206)', 'rgb(32,32,150)', 'rgb(30,30,110)'],
        borderColor: 'navy',
        borderWidth: 1,
        borderRadius: 3,
      }
    ]
  };

  const yearLabel = years.map((year) => year);
  //data for Bar
  //REMINDER: understand why its [years[0]] instead of years[0] below
  const barData = {
    labels: pmcInjuredLabel,
    datasets: [
      {
        label: yearLabel[0],
        data: pedestrianMotoristCyclistInjured([years[0]]),
        backgroundColor: 'rgb(28, 28, 206)',
        borderColor: 'navy',
        borderWidth: 1,
        borderRadius: 3
      },
      {
        label: yearLabel[1],
        data: pedestrianMotoristCyclistInjured([years[1]]),
        backgroundColor: 'rgb(32, 32, 150)',
        borderColor: 'navy',
        borderWidth: 1,
        borderRadius: 3
      }
    ]
  }

  //when toggle to Comparison section, render Bar instead of Pie
  if (isCompare) {
    return (
      <Bar
        data={barData}
        options={{
          aspectRatio: 1,
          plugins: {
            title: {
              display: true,
              text: `Number of Injured (Pedestrians, Motorists, Cyclists) in ${yearLabel[0]} and ${yearLabel[1]}`,
              font: {
                size: 16,
              }
            },
            tooltip: {
              padding: 10,
            }
          }
        }}
      />
    );
  }

  //render Pie by default AND when toggle to Recent 12 Years section
  return (
    <Pie
      data={pieData}
      options={{
        aspectRatio: 1,
        plugins: {
          legend: {
            position: 'left',
            labels: {
              padding: 20,  //within legend box
              font: {
                // size: 16,
                weight: 'bold',
              }
            }
          },
          title: {
            display: true,
            text: "Number of Injured (Pedestrians, Motorists, Cyclists)",
            font: {
              size: 16,
            }
          }
        }
      }}
    />
  );
}

const PedestriansMotoristsCyclistsKilledChart = ({years, isCompare}) => {
  const pieData = {
    labels: pmcKilledLabel,
    datasets: [
      {
        label: "Number of Killed",
        data: pedestrianMotoristCyclistKilled(years),
        backgroundColor: ['rgb(255,70,50)', 'lightcoral', 'lightsalmon'],
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 3,
      }
    ]
  };

  const yearLabel = years.map((year) => year);

  const barData = {
    labels: pmcKilledLabel,
    datasets: [
      {
        label: yearLabel[0],
        data: pedestrianMotoristCyclistKilled([years[0]]),
        backgroundColor: 'rgb(255, 70, 50)',
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 3
      },
      {
        label: yearLabel[1],
        data: pedestrianMotoristCyclistKilled([years[1]]),
        backgroundColor: 'lightcoral',
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 3
      }
    ]
  }

  //when toggle to Comparison section, render Bar instead of Pie
  if (isCompare) {
    return (
      <Bar
        data={barData}
        options={{
          aspectRatio: 1,
          plugins: {
            title: {
              display: true,
              text: `Number of Killed (Pedestrians, Motorists, Cyclists) in ${yearLabel[0]} and ${yearLabel[1]}`,
              font: {
                size: 16,
              }
            },
            tooltip: {
              padding: 10,
            }
          }
        }}
      />
    );
  }

  //render Pie by default AND when toggle to Recent 12 Years section
  return (
    <Pie
      data={pieData}
      options={{
        aspectRatio: 1,
        plugins: {
          legend: {
            position: 'left',
            labels: {
              padding: 20,  //within legend box
              font: {
                // size: 16,
                weight: 'bold',
              }
            }
          },
          title: {
            display: true,
            text: "Number of Killed (Pedestrians, Motorists, Cyclists)",
            font: {
              size: 16,
            }
          }
        }
      }}
    />
  );
  
}

// pie graph displaying number of crashes in each borough in the recent 12 years
const CrashesByBoroughChart = ({years, isCompare}) => {
  const pieData = {
    labels: boroughsLabel,
    datasets: [
      {
        label: "Number of People Killed",
        data: totalBoroughs(years),
        backgroundColor: ['indigo', 'purple', 'darkviolet', 'blueviolet', 'slateblue'],
        borderColor: 'indigo',
        borderWidth: 1,
        borderRadius: 3,
      }
    ]
  }

  const yearLabel = years.map((year) => year);

  const barData = {
    labels: boroughsLabel,
    datasets: [
      {
        label: yearLabel[0],
        data: totalBoroughs([years[0]]),
        backgroundColor: 'indigo',
        borderColor: 'indigo',
        borderWidth: 1,
        borderRadius: 3,
      },
      {
        label: yearLabel[1],
        data: totalBoroughs([years[1]]),
        backgroundColor: 'blueviolet',
        borderColor: 'indigo',
        borderWidth: 1,
        borderRadius: 3,
      }
    ]
  }

  //when toggle to Comparison section, render Bar instead of Pie
  if (isCompare) {
    return (
      <Bar
        data={barData}
        options={{
          aspectRatio: 1,
          plugins: {
            title: {
              display: true,
              text: `Number of Crashes in Each Borough in ${yearLabel[0]} and ${yearLabel[1]}`,
              font: {
                size: 16,
              }
            },
            tooltip: {
              padding: 10,
            }
          }
        }}
      />
    );
  }

  //render Pie by default AND when toggle to Recent 12 Years section
  return (
    <Pie
      data={pieData}
      options={{
        aspectRatio: 1,
        plugins: {
          legend: {
            position: 'left',
            labels: {
              padding: 20,  //within legend box
              font: {
                // size: 16,
                weight: 'bold',
              }
            }
          },
          title: {
            display: true,
            text: "Number of Crashes in Each Borough",
            font: {
              size: 16,
            }
          }
        }
      }}
    />
  );
}

function RecentTwelveYears(){
  // get the keys (year indexes) from the data and taking most recent 12 items
  const years = Object.keys(crashes_data_visualization).slice(-12);

  return (
    <div className="charts-graphs-container">
      <div className="chart-graph">
        <TotalCrashesChart years={years}/>
      </div>
      <div className="chart-graph">
        <RushHourPercentagesChart years={years}/>
      </div>
      <div className="chart-graph">
        <TotalInjuredChart years={years}/>
      </div>
      <div className="chart-graph">
        <TotalKilledChart years={years}/>
      </div>
      <div className="chart-graph">
        <PedestriansMotoristsCyclistsInjuredChart years={years} isCompare={false}/> {/*when toggle to Recent 12 Years section, set isCompare to false*/}
      </div>
      <div className="chart-graph">
        <PedestriansMotoristsCyclistsKilledChart years={years} isCompare={false}/>
      </div>
      <div className="chart-graph">
        <CrashesByBoroughChart years={years} isCompare={false}/>
      </div>
    </div>
  )
}

function CompareTwoYears(){
  // get the keys (year indexes) from the data
  const years = Object.keys(crashes_data_visualization);
  // set state of two years being compared and set default to the 2 most recent years
  const [twoYears, setTwoYears] = useState(Object.keys(crashes_data_visualization).slice(-2));
  // set state for 1st year
  const [year1, setYear1] = useState(twoYears[0]);
  // set state for 2nd year
  const [year2, setYear2] = useState(twoYears[1]);

  // dropdown component for comparing two years
  const CompareDropDown = () => {
  
    const options = years.map(year => {
      return (
        <option value={year}>
          {year}
        </option>
      )
    })
    // handle submit event for comparing 2 years
    const handleSubmit = (event) => {
      event.preventDefault();
      setTwoYears([year1, year2]) 
    }
  
    return (
      <form onSubmit={handleSubmit} className="compare-years">
        <select className="select" value={year1} onChange={(e) => setYear1(e.target.value)}>
          {options}
        </select>
        &
        <select className="select" value={year2} onChange={(e) => setYear2(e.target.value)}>
          {options}
        </select>
        <button className="compare-button" type="submit">
          Compare
        </button>
      </form>
    )
  }

  return (
    <div>
      <CompareDropDown />
      <div className="charts-graphs-container">
        <div className="chart-graph">
          <TotalCrashesChart years={twoYears}/>
        </div>
        <div className="chart-graph">
          <RushHourPercentagesChart years={twoYears}/>
        </div>
        <div className="chart-graph">
          <TotalInjuredChart years={twoYears}/>
        </div>
        <div className="chart-graph">
          <TotalKilledChart years={twoYears}/>
        </div>
        <div className="chart-graph">
          <PedestriansMotoristsCyclistsInjuredChart years={twoYears} isCompare={true}/> {/*when toggle to Compare Charts section, set isCompare to true*/}
        </div>
        <div className="chart-graph">
          <PedestriansMotoristsCyclistsKilledChart years={twoYears} isCompare={true}/>
        </div>
        <div className="chart-graph">
          <CrashesByBoroughChart years={twoYears} isCompare={true}/>
        </div>
      </div>
    </div>
  )
}

export default function DataVisualization() {
  const [activeData, setActiveData] = useState(true);

  const switchData = () => {
    setActiveData(prevActiveData => !prevActiveData);
  }

  return (
    <section className="charts_graphs_section">
      <div className="horizontal-line2"></div>
      <div className="charts-graphs-option">
        <input type="checkbox" id="toggle2" className="toggleCheckbox" />
        <label onClick={switchData} htmlFor="toggle2" className='toggleContainer'>
          <div>Recent Twelve Years</div>   
          <div>Compare Two Years</div>
        </label>
      </div>
      {activeData ? <RecentTwelveYears /> : <CompareTwoYears />}
    </section>
  )
}

{/* <div className="chart-graph">
        <Bar //can change to <Doughnut <Line <Bar ***NEVER DO <Chart because crash
          data={{
            labels: years,
            datasets: [
              {
                label: "Number of Crashes",
                data: totalCrashes,
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
                text: "Number of Crashes by Year in NYC",
                font: {
                  size: 16,
                }
              }
            }
          }}
        />
      </div> */}