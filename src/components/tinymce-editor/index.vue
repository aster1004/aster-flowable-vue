<template>
  <div style="height: 100%; overflow: hidden">
    <editor v-model="_value" :init="init" :disabled="readonly" :id="tinymceId"></editor>
  </div>
</template>

<script setup>
  import { computed, reactive, watch, ref, onMounted } from 'vue'; //全屏
  import { useGlobalStore } from '@/stores/modules/global';
  import { ImageUpload } from '@/config/fileConfig';
  import { uploadFile } from '@/api';
  import tinymce from 'tinymce/tinymce';
  import Editor from '@tinymce/tinymce-vue';

  import 'tinymce/icons/default/icons';
  import 'tinymce/themes/silver'; // 界面UI主题
  import 'tinymce/plugins/preview'; // 预览
  import 'tinymce/plugins/print'; // 打印
  import 'tinymce/plugins/fullscreen'; // 全屏
  import 'tinymce/plugins/code'; // 代码
  import 'tinymce/plugins/image'; // 图片
  import 'tinymce/plugins/table'; // 表格
  import 'tinymce/plugins/lists'; // 列表插件
  import 'tinymce/plugins/advlist'; // 高级列表
  import 'tinymce/plugins/link'; // 链接插件
  import 'tinymce/plugins/autolink'; // 自动链接
  import 'tinymce/plugins/insertdatetime'; // 日期时间
  import 'tinymce/plugins/charmap'; // 特殊符号
  import 'tinymce/plugins/anchor'; // 锚点
  import 'tinymce/plugins/searchreplace'; // 查找替换
  import 'tinymce/plugins/visualblocks'; // 显示元素范围
  import 'tinymce/plugins/wordcount'; // 字数统计
  import 'tinymce/plugins/directionality'; // 文本方向
  import 'tinymce/plugins/visualchars'; // 显示空格
  import 'tinymce/plugins/codesample'; //代码示例
  import 'tinymce/plugins/pagebreak'; // 分页符
  import 'tinymce/plugins/nonbreaking'; // 插入不间断空格
  import { ElMessage } from 'element-plus';
  import { ResultEnum } from '@/enums/httpEnum';

  const emits = defineEmits(['update:value', 'setHtml']);

  const props = defineProps({
    value: {
      type: String,
      default: () => {
        return '';
      },
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
      default: 500,
    },
    plugins: {
      type: [String, Array],
      default:
        'preview print searchreplace autolink directionality code visualblocks visualchars ' +
        'fullscreen link table image pagebreak nonbreaking anchor insertdatetime ' +
        'advlist lists wordcount charmap codesample',
    },
    toolbar: {
      type: [String, Array],
      default:
        'code fullscreen | undo redo | styles | bold italic underline strikethrough ' +
        '| alignleft aligncenter alignright alignjustify numlist bullist | link | table image | lineheight outdent indent| forecolor backcolor removeformat blockquote subscript superscript' +
        '| charmap | preview print | pagebreak anchor codesample | searchreplace',
    },
  });

  const globalStore = useGlobalStore();
  const tinymceEditor = ref();
  const tinymceId = ref('vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + ''));

  // 主题
  const _skinUrl = computed(() => {
    return globalStore.isDark ? '/tinymce/skins/ui/oxide-dark' : '/tinymce/skins/ui/oxide';
  });

  // 上传图片
  const handleUploadImage = function (blobInfo, success, failure) {
    new Promise(async (resolve, reject) => {
      let rawFile = blobInfo.blob();
      // 判断图片类型
      if (!ImageUpload.type.includes(rawFile.type)) {
        failure('上传文件必须是图片格式');
        return;
      } else if (rawFile.size / 1024 / 1024 > ImageUpload.maxSize) {
        // 判断图片大小
        failure('上传图片大小不能超过' + ImageUpload.maxSize + 'MB');
        return;
      }
      // 上传图片
      const formData = new FormData();
      formData.append('file', rawFile);
      await uploadFile(formData).then((res) => {
        if (res.code === ResultEnum.SUCCESS) {
          success(res.data.url);
        } else {
          failure(res.message);
        }
      });
    });
  };

  /**
   * @description 构造文本
   * @param {String} title 标题
   * @param {String} value 值
   */
  const textFormat = (title, value) => {
    return '<span class="field-content">' + '${' + title + ':' + value + '}</span>';
  };

  /**
   * @description 构造表格
   * @param {Object} field 表格字段
   */
  const createTable = (field) => {
    //const height = 40;
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    const trh = document.createElement('tr');
    const trd = document.createElement('tr');
    table.setAttribute('class', field.id);
    table.setAttribute('style', 'border-collapse: collapse; width: 99.8363%; height: 74px;');
    table.setAttribute('border', '1');
    table.appendChild(tbody);
    trh.setAttribute('style', 'height: 40px;');
    trd.setAttribute('style', 'height: 40px;');
    tbody.appendChild(trh);
    tbody.appendChild(trd);
    // 构造表格行
    field.props.columns.forEach((col) => {
      const tdh = document.createElement('td');
      const style = `width: ${(100 / field.props.columns.length).toFixed(3)}%; height: 40px;`;
      tdh.setAttribute('style', style);
      tdh.innerText = col.title;
      trh.appendChild(tdh);
      const tdd = document.createElement('td');
      tdd.setAttribute('style', style);
      tdd.innerHTML = textFormat(col.title, col.id);
      trd.appendChild(tdd);
    });
    const tableDom = document.createElement('span');
    tableDom.appendChild(table);
    return tableDom;
  };

  /**
   * @description 插入文本
   * @param {String} text 文本
   */
  const insertText = (text) => {
    tinymceEditor.value.execCommand('mceInsertContent', false, text);
  };

  /**
   * @description 插入dom
   * @param {Object} dom dom
   */
  const insertDom = (dom) => {
    insertText(dom.innerHTML);
  };

  /**
   * @description 拖拽到编辑器上
   * @param {Object} ev 事件
   */
  const dropElOnEditor = (ev) => {
    tinymce.activeEditor.focus();
    const text = ev.dataTransfer.getData('text');
    ev.dataTransfer.clearData();
    const cp = JSON.parse(text);
    if (cp.name && cp.name === 'TableList') {
      insertDom(createTable(cp));
    } else {
      insertText(textFormat(cp.title, cp.id));
    }
    ev.preventDefault();
  };

  /**
   * @description 初始化
   * @param {Object} editor 编辑器实例
   */
  const handleSetup = (editor) => {
    editor.on('init', (e) => {
      console.log('编辑器初始化完成...', editor);
      tinymceEditor.value = editor;
      editor.dom.doc.ondrop = dropElOnEditor;
    });
  };

  // 定义一个对象 init初始化
  const init = reactive({
    selector: '#' + tinymceId.value, //富文本编辑器的id,
    // 默认样式
    content_style: 'p {margin: 0; border:0; padding: 0;}',
    content_css: '/tinymce/skins/content/default/content.css', //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
    language_url: '/tinymce/langs/zh_CN.js', // 语言包的路径，具体路径看自己的项目
    language: 'zh_CN',
    skin_url: _skinUrl.value, // skin路径，具体路径看自己的项目
    height: props.height,
    promotion: false, // 隐藏右上角upgrade按钮
    branding: false, // 隐藏右下角“Powered by TinyMCE”
    menubar: true, // 显示顶部菜单
    contextmenu: false,
    elementpath: false, // 隐藏底栏的元素路径（隐藏右下角元素显示）
    object_resizing: true, // 是否允许调整图像大小.
    image_advtab: true,
    image_caption: true,
    valid_elements: '*[*]', // 允许所有标签和属性
    paste_webkit_styles: 'all', // 此选项允许您指定粘贴到 WebKit 中时要保留的样式 'none' 或者 'all'
    advlist_bullet_styles: 'default,circle,disc,square',
    link_default_target: '_blank', // 超链接默认打开方式
    link_title: false, // 此选项允许您禁用对话框中的链接输入字段
    nonbreaking_force_tab: true, // tab键插入三个&nbsp;
    relative_urls: false,
    convert_urls: false, // 设置为false，禁止将编辑器中的图片地址自动转为相对路径
    toolbar_mode: 'sliding', // 工具栏模式 floating / sliding / scrolling / wrap
    plugins: props.plugins,
    toolbar: props.toolbar,
    toolbar_sticky: true,
    inline: false,
    // 图片上传
    images_upload_handler: handleUploadImage,
    setup: handleSetup,
  });

  // 外部传递进来的数据变化
  const _value = computed({
    get() {
      return props.value;
    },
    set(val) {
      emits('update:value', val);
    },
  });

  //初始化编辑器
  onMounted(() => {
    tinymce.init({});
  });

  // 设置值
  const handleSetContent = (content) => {
    tinymce.activeEditor.setContent(content);
  };

  // 获取值
  const handleGetContent = () => {
    return tinymce.activeEditor.getContent();
  };

  defineExpose({
    handleSetContent,
    handleGetContent,
  });
</script>

<style>
  .tox-tinymce-aux {
    z-index: 88888 !important;
  }

  .tox .tox-toolbar__group {
    padding: 0 3px 0 5px !important;
  }
</style>
