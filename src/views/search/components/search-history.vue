<template>
    <div class="search-history">
        <van-cell title="搜索历史">
            <div v-if="isDeleteShow">
                <span @click="$emit('clear-search-histories', [] )" >全部删除</span>
                &nbsp;
                <span @click="isDeleteShow = false">完成</span>
            </div>
            <van-icon 
            v-else name="delete" 
            @click="isDeleteShow = true"
            />
        </van-cell>
        <van-cell 
            :title="item"
            v-for="(item, index) in searchHistories"
            :key= "index"
            @click="OnSearchItemClick(item,index)"
        >
            <van-icon 
                v-show="isDeleteShow"
                name="close" 
            />
        </van-cell>
  </div>
</template>

<script>
export default {
    name: 'SearchHistory',
    components: {},
    props: {
        //  Prop 数据
        //Prop受父组件数据影响的
        //  如果是普通数据（数字、字符串、布尔值）绝对不能改
        //  即使改了也不会传给父组件
        // 
        //  如果是引用数据类型 （数组、对象）
        //      可以修改，例如 [].push(xxx) ，对象.xxx = xxx
        //      不能重新赋值，xxx = []
        searchHistories: {
            type: Array,
            required:true
        }
    },
    data () {
        return {
            isDeleteShow: false
        }
    },
    computed: {},
    watch: {},
    created () {},
    mounted () {},
    methods: {
        OnSearchItemClick (item,index) {
            if (this.isDeleteShow){
                //删除状态，删除历史记录
                this.searchHistories.splice(index, 1)
            } else {
                //非删除状态，直接进入搜索
                this.$emit('search',item)
            }
        }
    }
}
</script>

<style lang="less" scoped>

</style>
