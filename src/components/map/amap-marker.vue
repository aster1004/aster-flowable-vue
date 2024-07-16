<template>
  <el-dialog v-model="visible" title="地图" :width="width" :lock-scroll="false" :z-index="999">
    <div :style="mapStyle" v-if="visible">
      <div class="map-home">
        <div id="map-box"></div>
        <div class="info-box">
          <el-input
            v-model="keyword"
            placeholder="输入关键字搜索"
            style="width: 300px"
            clearable
            @keyup.enter.native="handleSearch(keyword)"
          >
            <template #append>
              <span @click="handleSearch(keyword)">
                <i class="iconfont icon-sousuo"></i>
              </span>
            </template>
          </el-input>
          <div class="map-ul">
            <div v-for="(item, index) in data" :key="index" style="background: #ffffff">
              <el-divider v-if="index > 0" border-style="dashed" />
              <div class="map-li" @click="handleSelect(item)">
                <div class="map-d-flex">
                  <span>{{ item.name }}</span>
                  <span>地址：{{ item.address }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="submit">{{ $t('button.confirm') }}</el-button>
      <el-button @click="visible = false">{{ $t('button.cancel') }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { shallowRef, ref, PropType, computed } from 'vue';
  import AMapLoader from '@amap/amap-jsapi-loader';
  import { isEmpty } from '@/utils';

  const emits = defineEmits(['address']);
  const props = defineProps({
    form: {
      type: Object as PropType<WorkForm.GeoPositionModel>,
      default: null,
    },
    width: {
      type: [String, Number],
      default: '50%',
    },
    height: {
      type: Number,
      default: 400,
    },
  });

  const visible = ref(false);
  const map = shallowRef();
  const keyword = ref('');
  const addresstext = ref('');
  const data = ref<any[]>([]);
  const coord = ref<number[]>([]);
  const adcode = ref('');
  let AMapObj, placeSearch, marker, geocoder;

  // map 样式
  const mapStyle = computed(() => {
    return { width: '100%', height: `${props.height}px` };
  });

  // 初始化
  const init = () => {
    visible.value = true;
    initMap();
  };

  /**
   * @description: 初始化地图
   * @return {*}
   */
  const initMap = () => {
    AMapLoader.load({
      //设置您的key
      key: '581d079813247d27e9fef2e251e5ca49',
      version: '2.0',
      plugins: ['AMap.ToolBar', 'AMap.Driving'],
      AMapUI: {
        version: '1.1',
        plugins: [],
      },
      Loca: {
        version: '2.0.0',
      },
    })
      .then((AMap) => {
        AMapObj = AMap;
        map.value = new AMap.Map('map-box', {
          viewMode: '3D',
          zoom: 12,
          zooms: [2, 22],
          center: [116.397256, 39.908703],
        });

        map.value.on('click', onMapClick);
        AMap.plugin(['AMap.PlaceSearch', 'AMap.Geocoder', 'AMap.AutoComplete'], () => {
          geocoder = new AMap.Geocoder({
            city: '全国',
          });
          placeSearch = new AMap.PlaceSearch({
            city: '全国',
            pageSize: 10, // 单页显示结果条数
            pageIndex: 1, // 页码
            citylimit: false, // 是否强制限制在设置的城市内搜索
            autoFitView: true,
          });
        });
        if (props.form && props.form.hasOwnProperty('address')) {
          keyword.value = props.form.address;
          handleSearch(props.form.address);
          let e = {
            lnglat: {
              lng: props.form.longitude,
              lat: props.form.latitude,
            },
          };
          onMapClick(e);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 搜索地图
  const handleSearch = (str) => {
    if (isEmpty(str)) {
      data.value = [];
    }
    placeSearch.search(str, (status, result) => {
      if (result && typeof result === 'object' && result.poiList) {
        const list = result.poiList.pois;
        data.value = list;
      }
    });
  };

  // 点击地图
  const onMapClick = (e) => {
    coord.value = [e.lnglat.lng, e.lnglat.lat];
    geocoder.getAddress([e.lnglat.lng, e.lnglat.lat], function (status, result) {
      if (status === 'complete' && result.info === 'OK') {
        // result为对应的地理位置详细信息
        keyword.value = result.regeocode.formattedAddress;
        addresstext.value = result.regeocode.formattedAddress;
        adcode.value = result.regeocode.addressComponent.adcode.slice(0, 4) + '00';
      }
    });
    // 标记
    drawMarker(e.lnglat);
  };

  const onMapadcode = (e) => {
    geocoder.getAddress([e.location.lng, e.location.lat], function (status, result) {
      if (status === 'complete' && result.info === 'OK') {
        // result为对应的地理位置详细信息
        adcode.value = result.regeocode.addressComponent.adcode.slice(0, 4) + '00';
      }
    });
  };

  // 点击搜索项
  const handleSelect = (item) => {
    // 绘制地点
    drawMarker(item.location);
    onMapadcode(item);
    if (item.location != null) {
      coord.value = [item.location.lng, item.location.lat];
      keyword.value = item.name;
      addresstext.value = item.address + item.name;
    }
  };
  // 绘制地点marker
  const drawMarker = (location) => {
    if (location == null) return;
    let longitude = location.lng,
      latitude = location.lat;
    if (marker) {
      marker.setMap(null);
    }
    marker = new AMapObj.Marker({
      position: new AMapObj.LngLat(longitude, latitude),
      anchor: 'bottom-center',
    });
    marker.on('click', () => {
      coord.value = [longitude, latitude];
    });
    map.value.add(marker);
    map.value.setZoomAndCenter(16, [longitude, latitude]);
  };

  // 确定
  const submit = () => {
    emits('address', addresstext.value, coord.value, adcode.value);
    visible.value = false;
  };

  defineExpose({
    init,
  });
</script>

<style lang="scss" scoped>
  .map-home {
    height: 100%;
    width: 100%;
    padding: 0px;
    margin: 0px;
    position: relative;

    .info-box {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 300px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
  .map-ul {
    margin-top: 10px;
    height: 80%;
    overflow-y: auto;
    .map-li {
      padding: 5px 10px;
      min-height: 60px;
      .map-d-flex {
        background: #ffffff;
        color: #606266;
        display: flex;
        flex-direction: column;
      }
    }
  }

  #map-box {
    height: 100%;
    width: 100%;
    padding: 0px;
    margin: 0px;
  }
  .map-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 5px 0px;
  }
</style>

<style scoped>
  :deep() .amap-logo {
    display: none !important;
  }
  :deep() .amap-copyright {
    display: none !important;
  }
  :deep() .el-divider--horizontal {
    margin: 0px;
  }
</style>
