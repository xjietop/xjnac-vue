<template>
    <span>{{ timerStr }}</span>
</template>

<script>
import { setInterval, clearInterval } from 'timers';
export default {
    name: "DateTimer",
    props: ['endTime', 'pay'],
    data() {
        return {
            timerStr: '',
            timerFn: ''
        }
    },
    created() {
        this.start();
    },
    beforeDestroy() {
        clearInterval(this.timerFn);
    },
    methods: {
        timer() {
            const endTime = new Date(this.endTime).getTime();
            const startTime = new Date().getTime();
            const surplusTime = endTime - startTime;
            if (surplusTime <= 0){
                clearInterval(this.timerFn);
                this.timerStr = `0天0小时0分钟0秒`;
                this.$emit('timeover')
            } else {
                const ss = 1000;
                const mi = ss * 60;
                const hh = mi * 60;
                const dd = hh * 24;

                let day = parseInt(surplusTime / dd);
                let hour = parseInt((surplusTime - (day * dd)) / hh);
                let minute = parseInt((surplusTime - (day * dd + hour * hh)) / mi);
                let second = parseInt((surplusTime - (day * dd + hour * hh + minute * mi)) / ss);

                day = day < 10 ? '0' + day : day;
                hour = hour < 10 ? '0' + hour : hour;
                minute = minute < 10 ? '0' + minute : minute;
                second = second < 10 ? '0' + second : second;
                this.timerStr = `${day}天${hour}小时${minute}分钟${second}秒`;
            }
        },
        start() {
            this.timer();
            this.timerFn = setInterval(() => {
                this.timer();
            }, 1000)
        }
    }
}
</script> 
