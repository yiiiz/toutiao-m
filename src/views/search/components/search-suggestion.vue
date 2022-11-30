<template>
    <div class="search-suggestion">
        <van-cell 
        icon="search"
        v-for="(text , index) in suggestions"
        :key="index"
        @click="$emit('search',text)"
        >
            <div slot="title" v-html="highlight(text)"></div>
        </van-cell>
        <!-- 双大括号绑定直接输出纯文本内容 -->
        <!-- <div>{{htmlStr}}</div> -->

        <!-- 使用 v-html 指令可以绑定渲染带有HTML 标签的字符串 -->
        <div v-html="htmlStr"></div>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
//按需加载有好处：只会把使用到的成员打包到接口中
import { debounce } from 'lodash' 
export default {
    name: 'SearchSuggestion',
    components: {},
    props: {
        searchText:{
            type:String,
            required: true
        }
    },
    data () {
        return {
            suggestions:[], //联想建议数据列表
            htmlStr: 'Hello <span style="color: red">World</span>',
        }
    },
    computed: {},
    watch: {
        searchText:{
            //当searchText 发生改变之后就会调用handler函数
            //注意：handler函数语法是固定的
            // handler (value) {
            //     console.log(value)
            // },

            // debounced（防抖动）函数
            // 参数1： 一个函数
            // 参数2：延迟时间，单位是毫秒
            //返回值：防抖之后的函数
            handler:debounce (function (value) {
                this.loadSearchSuggestions(value)
            },200),
            // handler (value) {
            //     this.loadSearchSuggestions(value)
            // },
            immediate: true // 该回调将会在侦听开始之后立即调用
        }
    },
    created () {},
    mounted () {},
    methods: {
        async loadSearchSuggestions (q) {
            try{
                const { data } = await getSearchSuggestions(q)
                this.suggestions = data.data.options
            } catch (err) {
                this.$toast('数据获取失败，请稍后重试')
            } 
        },
        highlight (text) {
            const  highlightStr = `<span class="active">${this.searchText}</span>`
            // 正则表达式//中间的内容都会当成匹配字符来使用，而不是数据变量 g全局i忽略大小写
            //如果需要根据数据变量动态的创建正则表达式，则需要手动 new RegExp
            //RegExp正则构造函数
                // 参数1：匹配模式字符串，他会根据这个字符串创建正则对象
                //参数2：匹配模式，要写到字符串中
            const reg = new RegExp(this.searchText,'gi')
            //replace方法的字符串匹配只能替换第一个满足的字符
            if (text) {
                return text.replace(reg,highlightStr)
            }
        },
    }
}
</script>

<style lang="less" scoped>
.search-suggestion{
  /deep/  span.active {
        color:#3296fa 
    }
}
</style>
