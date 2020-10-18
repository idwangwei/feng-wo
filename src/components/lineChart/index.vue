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
          smooth: true,
          type: 'line',
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
          data: valueArr,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }];
      } else {
        const legend = Object.keys(data);
        if (legend.length > 0) {
          options.legend.data = legend;
          options.xAxis.data = data[legend[0]].map(v => v.time);
          options.series = legend.map(item => {
          return {
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 2
                }
              }
            },
            data: data[item].map(v => v.time),
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          };
        });
        }
      }

      this.chart.setOption(options);
    }
  }
};
</script>
