<template>
  <div class="channel-edit">
    <van-cell :border="false">
        <div slot="title" class="title-text">我的频道</div>
        <van-button
            class="edit-btn"
            type="danger"
            plain
            round
            size="mini"
            @click="isEdit = !isEdit"
            >
            {{isEdit ? '完成' : '编辑'}}
        </van-button>
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
        <van-grid-item 
            class="grid-item"
            v-for="(channel, index) in myChannels" 
            :key="index" 
            @click="onMyChannelClick(channel,index)"
        >
        <!--
            v-bind:class语法
            一个对象，对象中的key表示要作用的css类名
                    对象中的value要计算出布尔值
                    true，则作用该类名
                    false，不作用类名
        -->
            <van-icon 
            v-show="isEdit && !fiexdChannels.includes(channel.id)"
            slot="icon" 
            name="clear"
            ></van-icon>
            <span 
            class="text" 
            :class="{ active:index === active}"
            slot="text"
            > {{channel.name}}</span>
        </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
        <div slot="title">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
        <van-grid-item 
            class="grid-item"
            v-for="(channel, index) in recommendChannels" 
            :key="index" 
            icon="plus"
            :text="channel.name" 
            @click="onAddChannel(channel)"
        />
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
import { 
    getAllChannels, 
    addUserChannel,
    deleteUaerChannel
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'


export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels:{
        type:Array,
        required:true
    },
    active:{
        type:Number,
        required:true
    }
  },
  data () {
    return {
        allChannels:[],//所有频道
        isEdit:false,//控制编辑状态的显示
        fiexdChannels:[0]//固定频道，不允许删除
    }
  },
  computed: {
    ...mapState(['user']),
    //计算属性会观测内部以来数据的变化
    //如果以来的数据发生变化，则计算属性会重新执行
    recommendChannels () {
        //数组的filter方法，遍历数组，把符合条件的元素存储到新数组中并返回
        return this.allChannels.filter(channel => {
            // const channels = []
            
            //数组的find方法：遍历数组，把符合条件的第一个元素返回
            return !this.myChannels.find(myChannel => {
                return myChannel.id === channel.id
            })
        })
    }
    // recommendChannels(){
    //     const channels = []
    //     this.allChannels.forEach(channel =>{
    //         //find遍历数组，找到满足条件的元素项
    //         const ret = this.myChannels.find(myChannel =>{
    //             return myChannel.id === channel.id
    //         })

    //         //如果我的频道中不包括该频道项，则收集到推荐列表中
    //         if (!ret) {
    //             channels.push(channel)
    //         }
    //     })

    //     //把计算结果返回
    //     return channels
    // }
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    async loadAllChannels(){
        try{
            const { data } = await getAllChannels()
            this.allChannels = data.data.channels
        }catch(err){
            this.$toast('数据获取失败')
        }
    },
    async onAddChannel (channel) {
        try {
            this.myChannels.push(channel)
            //数据持久化处理
            if (this.user) {
                //已登录，把数据请求接口放到线上
                await addUserChannel({
                    id: channel.id, //频道ID
                    seq: this.myChannels.length //序号
                })
            }else{
                //未登录，把数据存储到本地
                setItem('TOUTIAO_CHANNELS', this.myChannels)
            }
        } catch (err) {
            this.$toast('保存失败，请稍后重试')
        }
    },

    onMyChannelClick ( channel, index) {
        if(this.isEdit){
            //如果是固定接口则不动
            if (this.fiexdChannels.includes(channel.id)){
                return
            }
            //如果是编辑状态，执行删除频道
            //splice (参数1 ， 参数2)
            //参数一：要删除的元素的索引
            //参数二：要删除的个数，如果不指定，则从参数一开始删除到最后
            if (index <= this.active){
                //让激活频道的索引-1
                this.$emit('update-active', this.active - 1, true)
            } 
            //删除用户频道
            this.myChannels.splice(index, 1)

            //4.处理持久化
            this.deleteChannel(channel)
        }else{
            // 非编辑状态，执行切换频道
            this.$emit('update-active' , index, false)
        }
    },

    async deleteChannel (channel) { 
        try{
            if (this.user) {
                //已登录，则将数据更新到线上
                await deleteUaerChannel(channel.id)
            }else{
                //未登录，将数据更新打本地
                setItem('TOUTIAO_CHANNELS', this.myChannels)
            }
        }catch (err) {
            this.$toast('操作失败，请稍后重试')
        }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit { 
    padding: 85px 0;

    .title-text{
        font-size: 32px;
        color: #333333;
    }

    .edit-btn{
        width: 104px;
        height: 48px;
        font-size: 26px;
        color: #f85959;
        border: 1px solid #f85959;
    }
/deep/ .grid-item{
        width: 160px;
        height: 86px;
        .van-grid-item__content {
            white-space: nowrap;//文字不折行
            background-color: #f4f5f6;
            .van-grid-item__text,.text {
                font-size: 28px;
                color: #222;
                margin-top: 0;
                
            }
            .active{
                color: red;
            }
            .van-grid-item__icon-wrapper {
                position: unset;
            }
        }
    }
    /deep/ .my-grid {
        .grid-item {
            .van-icon-clear {
                position: absolute;
                right: -10px;
                top: -10px;
                font-size: 30px;
                color: #cacaca;
                z-index: 2
            }
        }
    }

/deep/    .recommend-grid{
        .grid-item{
            .van-grid-item__content{
                flex-direction: row;
                .van-icon-plus{
                    font-size: 28px;
                    margin-right: 6px;
                }
                
            }
        }
    }
}
</style>