<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts';
require('echarts/theme/macarons'); // echarts theme
import resize from '@/mixins/resize';

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons');
      this.setOptions(this.chartData);
    },
    setOptions({ title, edgeColor, data } = {}) {
      let dateArr, valueArr;
      const options = {
        title: {
          text: title,
          left: '-5px',
          top: '-5px'
        },
        legend: {
          show: true,
          type: "scroll",
          left: "100px",
          right: "100px"
        },
        grid: {
          left: 40,
          right: 20,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        xAxis: {
          data: [],
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLabel: {
            showMaxLabel: true,
             rotate: 45
          }
        }
      };

      if (Array.isArray(data)) {
        dateArr = data.map(v => v.time);
        valueArr = data.map(v => v.count);
        options.xAxis.data = dateArr;
        options.series = [{
          itemStyle: {
            normal: {
              color: edgeColor || '#3888fa',
              lineStyle: {
                color: edgeColor || '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          smooth: true,
          type: 'line',
          data: valueArr,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }];
      } else {
        const legend = Object.keys(data);
        if (legend.length > 0) {
          options.legend.data = legend;

          let xaxis = [];
          legend.forEach(key => {
              xaxis.push(...data[key].map(v => v.time));
          });
          xaxis = Array.from(new Set(xaxis)).sort((v1, v2) => Date.parse(v1) - Date.parse(v2));
          options.xAxis.data = xaxis;
          options.series = legend.map(key => {
            return {
              name: key,
              itemStyle: {
                normal: {
                    lineStyle: {
                    width: 2
                    }
                }
              },
              data: xaxis.map(d => {
                const point = data[key].find(item => item.time === d);
                return point ? point.count : 0;
              }),
              smooth: true,
              type: 'line',
              animationDuration: 2800,
              animationEasing: 'quadraticOut'
            };
          });

          // console.log(xaxis);
          // console.log(options.series);
        }
      }

      this.chart.setOption(options);
    }
  }
};
</script>
