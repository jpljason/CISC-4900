import React, { useState, useEffect, useRef } from "react";
import "../styles/data-visualization.css"
import {Chart as ChartJS, Colors } from "chart.js/auto"
import { Line, Bar, Pie, Doughnut, Radar, PolarArea, Bubble, Scatter } from 'react-chartjs-2';
import crashes_data_visualization from "../data/crashes_data_visualization.json";
import factors_vehicles_visualization from "../data/factors_vehicles_visualization.json";

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
const TotalCrashesChart = ({years, isCompare}) => {
  //data property for <Bar />
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
  }
  //options property for <Bar />
  const options = {
    aspectRatio: 1,
    interaction: {
      mode: 'index',
      intersect: false
    },
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
  }
  // compare text 
  const CompareDescription = () => {
    const year1 = years[0];
    const year2 = years[1];
    const totalCrashes1 = totalCrashes(years)[0];
    const totalCrashes2 = totalCrashes(years)[1];
    const difference = Math.abs(totalCrashes1-totalCrashes2);
    const percentage = (((difference)/totalCrashes1)*100).toFixed(2);
    const increaseOrDecrease = totalCrashes1 >= totalCrashes2 ? difference + " or approximately " + percentage + "% more" : difference + " or approximately " + percentage + "% less";
    
    return (
      <div className="compare-desc">
        There are {increaseOrDecrease} crashes in {year1} compared to {year2}.
      </div>
    )
  }

  return (
      <div>
        <Bar data={data} options={options} />
        {isCompare && <CompareDescription />}
      </div>
  )
}

// line graph displaying percentages of crashes during rush hour in each year
const RushHourPercentagesChart = ({years, isCompare}) => {
  //data property for <Line />
  const data = {
    labels: years,
    datasets: [
      {
        // label: "Number of Crashes",
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
      },
    ],
  }
  if (isCompare) {

  }
  //options property for <Line />
  const options = {
    aspectRatio: 1,
    interaction: {
      mode: 'index',
      intersect: false
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return (value*100) + '%'; //convert y-axis to percent format
          },
        },
        min: 0.3,
        max: 0.5, //1 = 100%
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Percentage of Crashes Occuring During Rush Hour in NYC',
        font: {
          size: 16,
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {  //context=when user hovers each bar/plot
            const year = context.label;
            // const percentage = (crashes_data_visualization[2013].rush_hour_crashes / crashes_data_visualization[2013].total_crashes * 100).toFixed(3);
            const rushHourCrashes = crashes_data_visualization[year].rush_hour_crashes;
            return `Number of Crashes During Rush Hour: ${rushHourCrashes}`
          },
        },
      }
    },
  }

  const CompareDescription = () => {
    const year1 = years[0];
    const year2 = years[1];
    const totalCrashes1 = crashes_data_visualization[year1].rush_hour_crashes;
    const totalCrashes2 = crashes_data_visualization[year2].rush_hour_crashes;
    const totalPercentage1 = rushHourCrashes(years)[0]*100;
    const totalPercentage2 = rushHourCrashes(years)[1]*100;
    const difference = Math.abs(totalCrashes1-totalCrashes2);
    const percentageDifference = (Math.abs(totalPercentage1 - totalPercentage2)).toFixed(2);
    const increaseOrDecrease = totalPercentage1 >= totalPercentage2 ? percentageDifference + "% higher" : percentageDifference + "% lower";
    const increaseOrDecrease2 = totalCrashes1 >= totalCrashes2 ? difference + " more" : difference + " less";
    
    return (
      <div className="compare-desc">
        The percentage of rush hour crashes relative to the total number of crashes in {year1} is approximately {increaseOrDecrease} compared to {year2}. Overall, there are {increaseOrDecrease2} rush hour crashes in {year1} compared to {year2}.
        {/* There is approximately {percentageDifference}% more crashes that occured in rush hour based on the total amount of crashes that occured in {year1} compared to {year2}. Overall, there are {increaseOrDecrease} rush hour crashes in {year1} compared to {year2}. */}
      </div>
    )
  }
  return (
    <div>
      <Line data={data} options={options} />
      {isCompare && <CompareDescription />}
    </div>
  )
}

// bar graph displaying total number injured each year
const TotalInjuredChart = ({years, isCompare}) => {
  //data property for <Bar />
  const data = {
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
  }
  //options property for <Bar />
  const options = {
    aspectRatio: 1,
    interaction: {
      mode: 'index',
      intersect: false
    },
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
  }
  
  const CompareDescription = () => {
    const year1 = years[0];
    const year2 = years[1];
    const totalInjured1 = totalInjured(years)[0];
    const totalInjured2 = totalInjured(years)[1];
    const difference = Math.abs(totalInjured1-totalInjured2);
    const percentage = (((difference)/totalInjured1)*100).toFixed(2);
    const increaseOrDecrease = totalInjured1 >= totalInjured2 ? difference + " or approximately " + percentage + "% more" : difference + " or approximately " + percentage + "% less";
    return (
      <div className="compare-desc">
        There are {increaseOrDecrease} people injured in {year1} compared to {year2}.
      </div>
    )
  }
  return (
    <div>
      <Bar data={data} options={options} />
      {isCompare && <CompareDescription />}
    </div>
  )
}

// bar graph displaying total number killed each year
const TotalKilledChart = ({years, isCompare}) => {
  //data property for <Bar />
  const data = {
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
  }
  //options property for <Bar />
  const options = {
    aspectRatio: 1,
    interaction: {
      mode: 'index',
      intersect: false
    },
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
  }
  const CompareDescription = () => {
    const year1 = years[0];
    const year2 = years[1];
    const totalInjured1 = totalKilled(years)[0];
    const totalInjured2 = totalKilled(years)[1];
    const difference = Math.abs(totalInjured1-totalInjured2);
    const percentage = (((difference)/totalInjured1)*100).toFixed(2);
    const increaseOrDecrease = totalInjured1 >= totalInjured2 ? difference + " or approximately " + percentage + "% more" : difference + " or approximately " + percentage + "% less";
    return (
      <div className="compare-desc">
        There are {increaseOrDecrease} people killed in {year1} compared to {year2}.
      </div>
    )
  }
  return (
    <div>
      <Bar data={data} options={options} />
      {isCompare && <CompareDescription />}
    </div>
  )
}

// bar/pie graph displaying number of pedestrians/cyclists/motorists injured throughout the years
const PedestriansMotoristsCyclistsInjuredChart = ({years, isCompare}) => {
  //data for Pie
  const pieData = () => {
    const data = {
      labels: pmcInjuredLabel,
      datasets: [
        {
          label: "Number of Injured",
          data: pedestrianMotoristCyclistInjured(years),
          backgroundColor: ['rgb(28, 28, 206)', 'rgb(32,32,150)', 'rgb(30,30,105)'],
          borderColor: 'navy',
          borderWidth: 1,
          borderRadius: 3,
        }
      ]
    }
    return (
      <Pie
        data={data}
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
              text: `Number of Injured (Pedestrians, Motorists, Cyclists) ${years[0]} - ${years[9]}`,
              font: {
                size: 16,
              }
            }
          }
        }}
      />
    );
  };

  const yearLabel = years.map((year) => year);
  //data for Bar
  //REMINDER: understand why its [years[0]] instead of years[0] below
  const barData = () => {
    const data = {
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
    return (
      <Bar
        data={data}
        options={{
          aspectRatio: 1,
          interaction: {
            mode: 'index',
            intersect: false
          },
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
  
  //compare text 
  const CompareDescription = () => {
    const year1 = years[0];
    const year2 = years[1];
    const totalInjured1 = pedestrianMotoristCyclistInjured([year1]);
    const totalInjured2 = pedestrianMotoristCyclistInjured([year2]);
    console.log(totalInjured1);
    const pedestrians = Math.abs(totalInjured1[0]-totalInjured2[0]);
    const motorists = Math.abs(totalInjured1[1]-totalInjured2[1]);
    const cyclists = Math.abs(totalInjured1[2]-totalInjured2[2]);
    const pedestriansDifference = totalInjured1[0] >= totalInjured2[0] ? pedestrians + " more pedestrians" : pedestrians + " less pedestrians";
    const motoristsDifference = totalInjured1[1] >= totalInjured2[1] ? motorists + " more motorists" : motorists + " less motorists";
    const cyclistDifference = totalInjured1[2] >= totalInjured2[2] ? cyclists + " more cyclists" : cyclists + " less cyclists";
    return (
      <div className="compare-desc">
        There are {pedestriansDifference}, {motoristsDifference}, and {cyclistDifference} injured in {year1} compared to {year2}
      </div>
    )
  }

  return (
    <div>
      {isCompare && barData()} {/*When toggle to Comparison section, render Bar instead of Pie*/}
      {isCompare && <CompareDescription />}
      {!isCompare && pieData()} {/*Default is pie*/}
    </div>
  )
}

// bar/pie graph displaying number of pedestrians/cyclists/motorists killed throughout the years
const PedestriansMotoristsCyclistsKilledChart = ({years, isCompare}) => {
  const yearLabel = years.map((year) => year);
  
  const barData = () => {
    const data = {
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
    return (
      <Bar
        data={data}
        options={{
          aspectRatio: 1,
          interaction: {
            mode: 'index',
            intersect: false
          },
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

  const pieData = () => {
    const data = {
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
    }
    return (
      <Pie
        data={data}
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
              text: `Number of Killed (Pedestrians, Motorists, Cyclists) ${years[0]} - ${years[9]}`,
              font: {
                size: 16,
              }
            }
          }
        }}
      />
    );
  }

  const CompareDescription = () => {
    const year1 = years[0];
    const year2 = years[1];
    const totalKilled1 = pedestrianMotoristCyclistKilled([year1]);
    const totalKilled2 = pedestrianMotoristCyclistKilled([year2]);
    const pedestrians = Math.abs(totalKilled1[0]-totalKilled2[0]);
    const motorists = Math.abs(totalKilled1[1]-totalKilled2[1]);
    const cyclists = Math.abs(totalKilled1[2]-totalKilled2[2]);
    const pedestriansDifference = totalKilled1[0] >= totalKilled2[0] ? pedestrians + " more pedestrians" : pedestrians + " less pedestrians";
    const motoristsDifference = totalKilled1[1] >= totalKilled2[1] ? motorists + " more motorists" : motorists + " less motorists";
    const cyclistDifference = totalKilled1[2] >= totalKilled2[2] ? cyclists + " more cyclists" : cyclists + " less cyclists";
    return (
      <div className="compare-desc">
        There are {pedestriansDifference}, {motoristsDifference}, and {cyclistDifference} killed in {year1} compared to {year2}
      </div>
    )
  }

  //when toggle to Comparison section, render Bar instead of Pie
  return (
    <div>
      {isCompare && barData()} {/*When toggle to Comparison section, render Bar instead of Pie*/}
      {isCompare && <CompareDescription />}
      {!isCompare && pieData()} {/*Default is pie*/}
    </div>
  )
}

// pie/bar graph displaying number of crashes in each borough throughout the years
const CrashesByBoroughChart = ({years, isCompare}) => {
  const yearLabel = years.map((year) => year);
  const pieData = () => {
    const data = {
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
    return (
      <Pie
        data={data}
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
              text: `Number of Crashes in Each Borough ${years[0]} - ${years[9]}`,
              font: {
                size: 16,
              }
            }
          }
        }}
      />
    );
  }

  const barData = () => {
    const data = {
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
    return (
      <Bar
        data={data}
        options={{
          aspectRatio: 1,
          interaction: {
            mode: 'index',
            intersect: false
          },
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

  //brooklyn, bronx, queens, manhattan, staten island
  const CompareDescription = () => {
    const year1 = years[0];
    const year2 = years[1];
    const totalCrashes1 = totalBoroughs([year1]);
    const totalCrashes2 = totalBoroughs([year2]);
    const brooklyn = Math.abs(totalCrashes1[0]-totalCrashes2[0]);
    const bronx = Math.abs(totalCrashes1[1]-totalCrashes2[1]);
    const queens = Math.abs(totalCrashes1[2]-totalCrashes2[2]);
    const manhattan = Math.abs(totalCrashes1[3]-totalCrashes2[3]);
    const staten_island = Math.abs(totalCrashes1[4]-totalCrashes2[4]);
    const brooklynDifference = totalCrashes1[0] >= totalCrashes2[0] ? brooklyn + " more crashes in Brooklyn" : brooklyn + " less crashes in Brooklyn";
    const bronxDifference = totalCrashes1[1] >= totalCrashes2[1] ? bronx + " more crashes in Bronx" : bronx + " less crashes in Bronx";
    const queensDifference = totalCrashes1[2] >= totalCrashes2[2] ? queens + " more crashes in Queens" : queens + " less crashes in Queens";
    const manhattanDifference = totalCrashes1[3] >= totalCrashes2[3] ? manhattan + " more crashes in Manhattan" : manhattan + " less crashes in Manhattan";
    const statenIslandDifference = totalCrashes1[4] >= totalCrashes2[4] ? staten_island + " more crashes in Staten Island" : staten_island + " less crashes in Staten Island";
    return (
      <div className="compare-desc">
        There are {brooklynDifference}, {bronxDifference}, {queensDifference}, {manhattanDifference} and {statenIslandDifference} in {year1} compared to {year2}
      </div>
    )
  }

  return (
    <div>
      {isCompare && barData()} {/*When toggle to Comparison section, render Bar instead of Pie*/}
      {isCompare && <CompareDescription />}
      {!isCompare && pieData()} {/*Default is pie*/}
    </div>
  )
}

const ContributingFactorsChart = ({years, isCompare}) => {
  if(!isCompare){
    const allFactors = factors_vehicles_visualization["contributing_factors"];
    // take first 20 keys of contributing factors
    const contriFactorRec10 = Object.keys(allFactors).slice(0, 10);
    // access each contributing factor's name
    const factorNames = contriFactorRec10.map((factor) => allFactors[factor][0]);
    // access each count of the factor
    const counts = contriFactorRec10.map((factor) => allFactors[factor][1]);
    const data = {
      labels: factorNames,
      datasets: [
        {
          label: 'Occurrences',
          data: counts,
          backgroundColor: ['indigo', 'rgb(28, 28, 206)', 'red', 'purple', 'blue', 'rgb(255,70,50)', 'darkviolet', 'royalblue', 'lightcoral', 'violet'],
          borderColor: 'black',
          borderWidth: 1,
          borderRadius: 3,
        },
      ],
    }
    
    const options = {
      indexAxis: 'y', //horizontal bar
      scales: {
        x: {
          display: false,
        },
      },
      aspectRatio: 1,
      plugins: {
        // legend: {
        //   position: 'top',
        //   labels: {
        //     padding: 10,  //within legend box
        //     font: {
        //       size: 11,
        //       weight: 'bold',
        //     }
        //   }
        // },
        legend: false,
        
        title: {
          display: true,
          text: `Top 10 Contributing Factors of Crashes in NYC from ${years[0]} to ${years[9]}`,
          font: {
            size: 16,
          }
        }
      }
    }
    return (
      <Bar data={data} options={options} />
    );
  }
  // if the user is comparing 2 different years,
  else{
    const bothCharts = years.map((year) => {
      const factors = crashes_data_visualization[year]["top_10"]["contributing_factors"];
      // get the keys of all the factors for the year
      const factorKeys = Object.keys(factors);
      // access each factor name using the key
      const factorNames = factorKeys.map((factorKey) => factors[factorKey][0]);
      // access each count of the factor using the key
      const counts = factorKeys.map((factorKey) => factors[factorKey][1]);
      const data = {
        labels: factorNames,
        datasets: [
          {
            label: 'Occurrences',
            data: counts,
            backgroundColor: ['indigo', 'rgb(28, 28, 206)', 'red', 'purple', 'blue', 'rgb(255,70,50)', 'darkviolet', 'royalblue', 'lightcoral', 'violet'],
            borderColor: 'black',
            borderWidth: 1,
            borderRadius: 3,
          }
        ],
      }
      //options property for <Bar />
      const options = {
        indexAxis: 'y', //horizontal bar
        scales: {
          x: {
            display: false,
          },
        },
        aspectRatio: 1,
        plugins: {
          legend: false,
          title: {
            display: true,
            text: `Top 10 Contributing Factors of Crashes in NYC in ${year}`,
            font: {
              size: 16,
            }
          }
        }
      }
      return (
        <Bar data={data} options={options} />
      );
    })
    return bothCharts;
  }
}

const VehicleTypesChart = ({years, isCompare}) => {
  if(!isCompare){
    const allVehicles = factors_vehicles_visualization["vehicle_types"];
    // take first 20 keys of contributing factors
    const vehicleTypesRec10 = Object.keys(allVehicles).slice(0, 10);
    // access each vehicle type's name
    const vehicleTypes = vehicleTypesRec10.map((vehicle) => allVehicles[vehicle][0]);
    // access each count of the type
    const counts = vehicleTypesRec10.map((vehicle) => allVehicles[vehicle][1]);
    const data = {
      labels: vehicleTypes,
      datasets: [
        {
          label: 'Occurrences',
          data: counts,
          backgroundColor: ['indigo', 'rgb(28, 28, 206)', 'red', 'purple', 'blue', 'rgb(255,70,50)', 'darkviolet', 'royalblue', 'lightcoral', 'violet'],
          borderColor: 'black',
          borderWidth: 1,
          borderRadius: 3,
        }
      ],
    }
    
    const options = {
      indexAxis: 'y', //horizontal bar
      scales: {
        x: {
          display: false,
        },
      },
      aspectRatio: 1,
      plugins: {
        // legend: {
        //   position: 'left',
        //   labels: {
        //     padding: 10,  //within legend box
        //     font: {
        //       size: 11,
        //       weight: 'bold',
        //     }
        //   }
        // },
        legend: false,
        title: {
          display: true,
          text: `Top 10 Vehicle Types of Crashes in NYC from ${years[0]} to ${years[9]}`,
          font: {
            size: 16,
          }
        }
      }
    }
    return (
      <Bar data={data} options={options} />
    );
  }
  else{
    const bothCharts = years.map((year) => {
      const vehicles = crashes_data_visualization[year]["top_10"]["vehicle_types"];
      // get the keys of all the factors for the year
      const vehicleKeys = Object.keys(vehicles);
      // access each factor name using the key
      const vehicleNames = vehicleKeys.map((vehicleKey) => vehicles[vehicleKey][0]);
      // access each count of the factor using the key
      const counts = vehicleKeys.map((vehicleKey) => vehicles[vehicleKey][1]);
      const data = {
        labels: vehicleNames,
        datasets: [
          {
            label: 'Occurrences',
            data: counts,
            backgroundColor: ['indigo', 'rgb(28, 28, 206)', 'red', 'purple', 'blue', 'rgb(255,70,50)', 'darkviolet', 'royalblue', 'lightcoral', 'violet'],
            borderColor: 'black',
            borderWidth: 1,
            borderRadius: 3,
          }
        ],
      }
      //options property for <Bar />
      const options = {
        indexAxis: 'y', //horizontal bar
        scales: {
          x: {
            display: false,
          },
        },
        aspectRatio: 1,
        plugins: {
          legend: false,
          title: {
            display: true,
            text: `Top 10 Vehicle Types for Crashes in NYC in ${year}`,
            font: {
              size: 16,
            }
          }
        }
      }
      return (
        <Bar data={data} options={options} />
      );
    })
    return bothCharts;
  }
}

function RecentTwelveYears(){
  // get the keys (year indexes) from the data and taking most recent 10 items
  const years = Object.keys(crashes_data_visualization).slice(-10);

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
        <PedestriansMotoristsCyclistsInjuredChart years={years} /> {/*when toggle to Recent 12 Years section, set isCompare to false*/}
      </div>
      <div className="chart-graph">
        <PedestriansMotoristsCyclistsKilledChart years={years} />
      </div>
      <div className="chart-graph">
        <CrashesByBoroughChart years={years} />
      </div>
      <div className="chart-graph">
        <ContributingFactorsChart years={years} isCompare={false}/>
      </div>
      <div className="chart-graph">
        <VehicleTypesChart years={years} isCompare={false}/>
      </div>
    </div>
  )
}

function CompareTwoYears(){
  // get the keys (year indexes) from the data
  const years = Object.keys(crashes_data_visualization); //ignore first 2 keys/indexes
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
          <TotalCrashesChart years={twoYears} isCompare={true}/>
        </div>
        <div className="chart-graph">
          <RushHourPercentagesChart years={twoYears} isCompare={true}/>
        </div>
        <div className="chart-graph">
          <TotalInjuredChart years={twoYears} isCompare={true}/>
        </div>
        <div className="chart-graph">
          <TotalKilledChart years={twoYears} isCompare={true}/>
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
        <div className="compare-chart-graph"> 
          <div className="chart-graph">
            <ContributingFactorsChart years={[twoYears[0]]} isCompare={true}/>
          </div>
          <div className="chart-graph">
            <ContributingFactorsChart years={[twoYears[1]]} isCompare={true}/>
          </div>
        </div>
        <div className="compare-chart-graph"> 
          <div className="chart-graph">
            <VehicleTypesChart years={[twoYears[0]]} isCompare={true}/>
          </div>
          <div className="chart-graph">
            <VehicleTypesChart years={[twoYears[1]]} isCompare={true}/>
          </div>
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
          <div>Recent Ten Years</div>   
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