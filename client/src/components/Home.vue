<template>
  <div>
    <button @click="login">登录</button>
    <button @click="getList">请求带权限的接口</button>
    <button @click="getDetail">请求带权限的接口2</button>
    <p>list加载中：{{ loadingList }}</p>
    <p>detail加载中：{{ loadingDetail }}</p>

    <div>
      <button @click="cancelToken">后台禁止用户登录</button>
    </div>
  </div>
</template>
<script setup>
import { setRefreshToken, setAccessToken} from '@/plugins/utils.js'
import axios from '@/plugins/axios';
import { ref } from 'vue'

let loadingList = ref(false)
let loadingDetail = ref(false)

function login() {
  axios.post('/api/auth/login').then(res => {
    const { access_token, refresh_token } = res.data.data
    setRefreshToken(refresh_token)
    setAccessToken(access_token)
    console.log('登录成功')
  }).catch(err => {
    console.error(err)
    alert('登录失败')
  })
}

function getList() {
  loadingList.value = true
  axios.post('/api/auth/list').then(res => {
    console.log('请求list成功')
    loadingList.value = false
  }).catch(err => {
    console.log('请求list失败',err)
  })
}

function getDetail()  {
  loadingDetail.value = true
  axios.post('/api/auth/detail').then(res => {
    console.log('请求detail成功')
    loadingDetail.value = false
  }).catch(err => {
    console.log('请求detail失败',err)
  })
}

function cancelToken() {
  axios.post('/api/auth/cancel')
}
</script>
