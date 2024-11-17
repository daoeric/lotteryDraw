<template>
    <div>
<!--        <div class="AD-Banner">-->
<!--            <img src="../../assets/img/ad01.jpg">-->
<!--        </div>-->
            <div class="container">
              <div class="marquee-container">
                <img src="../../assets/img/speaker.png" alt="小喇叭" class="marquee-icon">
                <div class="marquee-wrapper">
                  <div class="marquee-content" :style="{ animationDuration: `${scrollDuration}s` }">
                      <span v-for="(message, index) in scrollingMessages" :key="index">
                        {{ message }}
                      </span>
                  </div>
                </div>
              </div>

                <div class="AC-Details">
                    <div>活动上线后，根据前一天的代收额度领取抽奖次数，每20万额度可以抽取一次
                      <a class="fr" href="#" @click="getLotteryChances">领取抽奖次数</a></div>
                </div>
                <div class="Lottery-Number">您还有{{AwardNum}}次抽奖机会!</div>
                <div class="Turnplate-Banner">
                    <div class="turnplate"> <img  :style="{transform:rotate_angle}" :class="rotate_transition" id="wheelcanvas" src="../../assets/img/turnplate.png"> <img class="pointer" @click="doLot" src="../../assets/img/turnplate-pointer.png?new"> </div>
                        <!--转盘代码 结束 -->
                    </div>
                </div>
                <div class="container01">
                    <div class="Explain">我的奖品(最新20条)</div>
                    <div class="winner-table">
                      <table>
                        <thead>
                        <tr>
                          <th>用户昵称</th>
                          <th>奖品名称</th>
                          <th>中奖时间</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(winner, index) in winners" :key="index">
                          <td>{{ winner.codeName }}</td>
                          <td>{{ winner.remark }}</td>
                          <td>{{ winner.createTime }}</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                </div>
<!--                  <div class="jpgz">
                      <div class="jpgz1"><a href="rule.html" class="z_award">活动规则</a></div>
                      <div class="jpgz1"><a href="myAward.html">我的奖品</a></div>
                  </div>-->
              </div>
</template>
<script>
import {queryTimes,spain,queryAwardList,timesAward,topestList} from '@/utils/api';
export default {
    data() {
        return {
            rotate_angle: -1, //将要旋转的角度
            rand_circle: 8, //旋转多少圈
            rotate_transition: "rotate-transition1", //初始化选中的过度属性控制
            click_flag: true, //是否可以旋转抽奖
            lotIndex: 0,
            AwardNum: 0,
            token: null,
            prizeList: [{
                    id: 7,
                    name: "现金188元"
                },
                {
                    id: 0,
                    name: "苹果16PRO"
                },
                {
                    id: 1,
                    name: "现金18元"
                },
                {
                    id: 2,
                    name: "现金888元"
                },
                {
                    id: 3,
                    name: "现金1888元"
                },
                {
                    id: 4,
                    name: "现金58元"
                },
                {
                    id: 5,
                    name: "现金38元"
                },
                {
                    id: 6,
                    name: "现金88元"
                }
            ],
          winners: [

          ],
          scrollingMessages: [
          ],
          scrollDuration: 10, // 控制滚动速度（秒）
          isBaoYue: [{ show: false }, { show: false }, { show: false }]
        }
    },
    created() {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; Admin-Token=`);
      this.token = parts.pop().split(';').shift();
      if(!this.token){
        alert("请使用码商后台跳转！");
      }
      this.getTimes();
      this.getAwartList();
      this.getTopList();

    },
  computed: {
    totalMessageLength() {
      return this.scrollingMessages.join("    ").length; // 计算总字符长度
    },
  },
    methods: {

      getTopList(){
        topestList().then(rs=>{
          const formattedData = rs.data.data.map(
              (record) => `${record.user}领取${record.prize}`
          );
          // 将转换后的数据推送到 scrollingMessages 数组
          this.scrollingMessages.push(...formattedData);
          this.scrollingMessages = this.scrollingMessages.slice(0, 10);
          console.log("scrollingMessages:"+this.scrollingMessages)
          this.rotate_angle = "rotate(" + this.rotate_angle + "deg)";
          this.scrollDuration = this.totalMessageLength / 5; // 每秒滚动5个字符
        })
      },
      getLotteryChances(event){
        // 阻止默认跳转行为
        event.preventDefault();
        timesAward().then(rs=>{
          alert(rs.data.msg);
        });
      },
       getAwartList(){
         queryAwardList().then(rs=>{
           this.winners = rs.data.data;

         })
       },
        rndNum: function() {
            //随机获得奖品
            return Math.floor(Math.random() * 8)
        },
        doLot() {
            var _this = this;
            if (_this.click_flag) {
                if (_this.AwardNum == 0) {
                    alert("您没有抽奖机会!");
                    return false
                }
                _this.click_flag = false;
                _this.lotIndex = _this.rndNum();
                _this.AwardNum -= 1; //减少一次抽奖机会

              //调用后端抽奖接口
              spain().then(re=>{
                _this.lotIndex = re.data.data;
                _this.rotateAngle(_this.lotIndex);
                this.getTimes();

              }).catch(()=>{
                //console.error("抽奖接口调用失败：", error);
                alert("网络错误，请稍后重试！");
              })
                //_this.rotateAngle(_this.lotIndex);
            }

        },
        rotateAngle(item) {
            var _this = this;
            var angles = item * (360 / _this.prizeList.length) - (360 / (_this.prizeList.length * 2));
            if (angles < 270) {
                angles = 270 - angles;
            } else {
                angles = 360 - angles + 270;
            }
            angles = angles + _this.rand_circle * 360;
            _this.rotate_angle = "rotate(" + angles + "deg)";
            _this.rotate_transition = "rotate-transition1";
            setTimeout(function() {
                alert("您抽中了" + _this.prizeList[(item + 1) > _this.prizeList.length - 1 ? 0 : item + 1].name)
                _this.click_flag = true;
                _this.game_over();
            }, (_this.rand_circle - 1) * 1000); // 延时，保证转盘转完
        },
        game_over() {
            this.click_flag = true;
            this.rotate_transition = "rotate-transition2";
            this.rotate_angle = "rotate(" + 0 + "deg)";
        },

        //获取抽奖次数
        getTimes(){
          queryTimes().then(rs=>{
            this.AwardNum = rs.data.data;
          })
        }
    }
}
</script>
<style lang="less">
* {
    margin: 0;
    padding: 0;
}

body,
ul,
ol,
li,
p,
h1,
h2,
h3,
h4,
h5,
h6,
form,
fieldset,
table,
td,
img,
div {
    margin: 0;
    padding: 0;
    border: 0;
}

body {
    background: #6c97d5;
    background-size: 100%;
    overflow-x: hidden;
    color: #696969;
    font-size: 36px;
    font-family: "Microsoft YaHei", "Helvetica";
}

ul,
ol {
    list-style-type: none;
}

select,
input,
img,
select {
    vertical-align: middle;
}

input {
    font-size: 1em;
}

a {
    text-decoration: none;
    color: #000;
}

a:hover {
    color: #000;
    text-decoration: none;
}

.fl {
    float: left;
}

.fr {
    float: right;
}

.btn {
    background: #fabe00;
    border-radius: 8px;
    color: #000;
    font-size: 1em;
    height: 36px;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
    padding: 0 10px;

    a {
        color: #fff;
    }
}


.container {
    padding: 5px 10px 10px 10px;
    margin: 0 auto;
    background: url(../../assets/img/turnplate_bg.png) no-repeat bottom;
    background-size: 100%;
}

.container01 {
    background: #9bbbe9;
    padding: 5px 10px 10px 10px;
    margin: 0 auto;
}

.container02 {
    padding: 5px 10px 10px 10px;
    margin: 0 auto;
}

#wheelcanvas {
    width: 100%;
    transform: rotate(0deg);
}
.rotate-transition1{
    transition:transform 6s ease-in-out;
}
.rotate-transition2{
    transition:transform 0s ease-in-out;
}
.AD-Banner {
    overflow: hidden;

    img {
        width: 100%;
    }
}

.AC-Details {
    font-size: 12px;
    line-height: 20px;
    width: 100%;
    height: 70px;
    color: #fff;

    div {
        padding: 15px;
    }

    a {
        color: #fabe00;
        text-decoration: underline;
    }
}



.layout {
    background: #fff;
    padding: 30px 10px 30px 10px;
    margin-top: -4%;
    margin-bottom: 10px;
}

.layout01 {
    background: #fff;
    padding: 30px 0;
    margin-top: -4%;
    margin-bottom: 10px;
}


.Lottery-Number {
    background: #e9545f;
    font-size: 20px;
    color: #fff;
    text-align: center;
    margin: 10px auto;
    line-height: 40px;
    width: 80%;
    border-radius: 20px;

    span {
        color: #fabe00;
        font-size: 1.25em;
        padding: 0 3px;
    }

}


.Turnplate-Banner {
    display: block;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
}

.Turnplate-Banner .turnplate {
    display: block;
    width: 100%;
    position: relative;

}
.Turnplate-Banner .turnplate img.pointer {
    position: absolute;
    width: 35.5%;
    height: 42.5%;
    left: 32.6%;
    top: 25%;
    cursor: pointer;
}



.Explain {
    background: url(../../assets/img/icon01.png) no-repeat;
    background-size: 27px;
    text-indent: 2.5em;
    font-size: 1.4em;
    line-height: 24px;
    color: #1a437f;
    margin-bottom: 10px;
}


.Month-sum {
    background: #fff;
    display: -webkit-box;
    padding: 30px 10px 10px 10px;
    margin-top: -4%;
    font-size: 0.9em;
}

.Month-sum strong {
    font-size: 1.25em;
}

.Month-sum div {
    -webkit-box-flex: 1;
}

.Month-sum .month-img {
    width: 40%;
}

.Month-sum .month-img img {
    width: 96%;
}

.Month-sum .txt {
    width: 70%;
    line-height: 26px;
    position: relative;
}

.Month-sum-bg img {
    width: 100%;
}

.Month-btn {
    right: 0px;
    top: 5px;
    position: absolute;
    width: 45%;
}

.Month-btn .ydy {
    background: url(../../assets/img/ydy.png) no-repeat;
    background-size: 100%;
    height: 80px;
}

.info-txt {
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    display: -webkit-box;
    overflow: hidden;
}

.jpgz {
    background: #4e7aba;
    display: -webkit-box;
    height: 60px;
}

.jpgz1 {
    -webkit-box-flex: 1;
    height: 40px;
    margin-top: 10px;
}

.jpgz1 a {
    display: block;
    height: 100%;
    width: 100%;
    text-align: center;
    font-size: 1.25em;
    line-height: 40px;
    color: #fff;
}

.winner-table {
  margin-top: 20px;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.winner-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  text-align: center;
  color: #333;
}

.winner-table thead {
  background: #e9545f;
  color: #fff;
}

.winner-table th,
.winner-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.winner-table tbody tr:hover {
  background: #f9f9f9;
}

.winner-table tbody tr:last-child td {
  border-bottom: none;
}

.marquee-container {
  display: flex;
  align-items: center;
  overflow: hidden;
  height: 40px; /* 容器高度 */
  background: #6c97d5; /* 背景色，可根据需求调整 */
  border-radius: 8px;
  padding: 5px 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.marquee-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.marquee-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.marquee-content {
  display: inline-block;
  white-space: nowrap;
  animation: marquee linear infinite;
  font-size: 18px; /* 更大的字体 */
  font-weight: bold; /* 加粗 */
  color: #ffcc00; /* 醒目的黄色 */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* 添加阴影 */
}

@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}




</style>
