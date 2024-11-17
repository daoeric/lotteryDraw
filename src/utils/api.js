import request from '@/utils/request'

export function queryTimes() {
    return request({
        url: '/turntable/times',
        method: 'get',
    })
}


export function spain() {
    return request({
        url: '/turntable/spain',
        method: 'get',
    })
}

export function queryAwardList() {
    return request({
        url: '/turntable/award/list',
        method: 'get',
    })
}

export function timesAward() {
    return request({
        url: '/turntable/times/reward',
        method: 'get',
    })
}

export function topestList() {
    return request({
        url: '/turntable/topest/list',
        method: 'get',
    })
}



