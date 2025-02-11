<template>
  <div id="comment" ref="commentRef" :class="{ narrow: isNarrow }">
    <!-- 顶部评论表单 -->
    <comment-form :upload-img="uploadImg" @form-submit="formSubmit" ref="comment-form">
      <img class="avatar" :src="user.avatar || defaultAvatar" @error="onError($event)" />
    </comment-form>

    <!-- 底部评论列表 -->
    <div v-if="cacheData.length > 0" class="comment-list" ref="comment-list">
      <!-- 单条评论 -->
      <comment-item
        v-for="(comment, i) in cacheData"
        :id="`comment-${i}`"
        :key="`comment-${i}`"
        :ref="`comment-${i}`"
        :user="user"
        :comment="comment"
        @comment-reply="hasForm"
        @comment-like="handleCommentLike"
        @comment-delete="handleCommentDelete"
      >
        <!-- 回复表单 -->
        <template #default="{ id }">
          <comment-form
            v-if="forms.includes(id)"
            :id="id"
            :parent="comment"
            :placeholder="`回复${comment.user.name}...`"
            :upload-img="uploadImg"
            @form-submit="formSubmit"
            @form-delete="deleteForm"
          />
        </template>

        <!-- 单条评论下的回复列表 -->
        <template #subList="{ parentId }">
          <div class="sub-comment-list">
            <!-- 单条回复 -->
            <comment-item
              v-for="(child, j) in comment.children"
              :id="`${parentId}-${j}`"
              :key="`${parentId}-${j}`"
              :ref="`${parentId}-${j}`"
              :comment="child"
              :user="user"
              :parent="comment"
              @comment-reply="hasForm"
              @comment-like="handleCommentLike"
              @comment-delete="handleCommentDelete"
            >
              <!-- 单条回复的回复表单 -->
              <comment-form
                v-if="forms.includes(`${parentId}-${j}`)"
                :id="`${parentId}-${j}`"
                :ref="`${parentId}-${j}`"
                :comment="child"
                :parent="comment"
                :placeholder="`回复${child.user && child.user.name}...`"
                :upload-img="uploadImg"
                @form-delete="deleteForm"
                @form-submit="formSubmit"
              />
            </comment-item>
          </div>
        </template>
      </comment-item>
    </div>
  </div>
</template>
<script setup lang="ts">
  import CommentForm from './comment-form.vue';
  import CommentItem from './comment-item.vue';
  import {
    ref,
    reactive,
    nextTick,
    computed,
    onMounted,
    watchEffect,
    getCurrentInstance,
    onBeforeUnmount,
  } from 'vue';
  import defaultAvatar from '@/assets/images/avatar.png';
  import { ElMessageBox } from 'element-plus';
  import { useI18n } from 'vue-i18n';

  // 国际化
  const { t } = useI18n();
  // @ts-ignore
  const { proxy } = getCurrentInstance();

  const emits = defineEmits(['input']);

  const props = defineProps({
    /* 数据 */
    data: {
      type: Array,
      default: () => [],
      required: true,
    },
    /* 当前用户 */
    user: {
      type: Object,
      default: () => {},
      required: true,
    },
    /* 配置属性 */
    props: {
      type: Object,
      default: () => {},
    },
    /* 提交表单前事件 */
    beforeSubmit: {
      type: Function,
      required: true,
    },
    /* 执行点赞前事件 */
    beforeLike: {
      type: Function,
      required: true,
    },
    /* 执行删除前事件 */
    beforeDelete: {
      type: Function,
      required: true,
    },
    /* 上传图片 */
    uploadImg: {
      type: Function,
      required: true,
    },
  });

  interface origin {
    id: string;
    content: string;
    imgSrc: string;
    children: Array<origin>;
    likes: number;
    reply: string | null;
    createAt: string | null;
    user: object;
    liked: boolean;
  }

  const commentRef = ref();
  const isNarrow = ref(false);
  const forms = ref<Array<string>>([]); // 显示在视图上的所有表单 id
  const cacheData: any = ref([]);
  const data: any = ref([]);

  const computedProps = computed(() => {
    if (!props.props) return null;
    const entries = Object.entries<any>(props.props);
    return entries.length > 0 ? entries : '';
  });

  /**
   * 处理初始数据
   */
  const processData = () => {
    // console.log('processData');
    cacheData.value = props.data.map((t) => comparePropsAndValues(t));
    // console.log('cacheData--->', cacheData.value);
  };

  /**
   * 对比和检查每条评论对象字段值
   */
  const comparePropsAndValues = (comment) => {
    // 初始对象
    const originObj = reactive<origin>({
      id: '',
      content: '',
      imgSrc: '',
      children: [],
      likes: 0,
      reply: null,
      createAt: null,
      user: {},
      liked: false,
    });

    // 赋值
    for (const key in originObj) {
      originObj[key] = comment[props.props[key]] || comment[key] || originObj[key];

      // 校验
      validate({ key, value: originObj[key] });
    }

    if (originObj.children.length > 0) {
      originObj.children = originObj.children.map(comparePropsAndValues);
    }

    return originObj;
  };

  /**
   * 校验数据
   */
  const validate = ({ key, value }) => {
    const map = {
      user: {
        validate: function (v) {
          return (typeof v !== 'object' || JSON.stringify(v) === '{}') && this.message;
        },
        message: 'User must be an object with props.',
      },
      reply: {
        validate: function (v) {
          return typeof v !== 'object' && this.message;
        },
        message: 'Reply must be an object',
      },
      children: {
        validate: function (v) {
          return !Array.isArray(v) && this.message;
        },
        message: 'Children must be an array',
      },
      createAt: {
        validate: function () {
          return new Date(value).toString() === 'Invalid Date' && this.message;
        },
        message: 'CreateAt is not a valid date.',
      },
    };

    const target = map[key];
    if (!target) return;

    const res = target.validate(value);
    if (res) {
      throw new Error(`validate(): ${res}`);
    }
  };

  /**
   * 将更新后的数组中的对象数据转换为初始对象结构
   */
  const transformToOriginObj = (comment) => {
    try {
      const _comment = JSON.parse(JSON.stringify(comment));

      if (_comment.children && _comment.children.length > 0) {
        _comment.children = _comment.children.map((t) => transformToOriginObj(t));
      }

      // 返回 props 中自定义的字段名
      if (!computedProps.value) return _comment;

      for (const [key, value] of computedProps.value) {
        if (key !== value && Object.hasOwnProperty.call(_comment, key)) {
          _comment[value] = JSON.parse(JSON.stringify(_comment[key]));
          delete _comment[key];
        }
      }

      return _comment;
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * 判断是否已存在该id的表单，存在删除该表单，不存在则新增该表单，并触发其他表单blur事件
   */
  const hasForm = (id: string) => {
    forms.value.includes(id) ? deleteForm(id) : addForm(id);
    broadcastBlur(proxy?.$refs['comment-list']?.$refs, id);
  };

  /**
   * 增加新表单
   */
  const addForm = (id: string) => {
    forms.value.push(id);
    // this.scrollIntoView(`${id}-form`)
  };

  /** 删除表单 */
  const deleteForm = (id: string) => {
    const index = forms.value.indexOf(id);
    index > -1 && forms.value.splice(index, 1);
  };

  /**
   * 评论或回复
   */
  const formSubmit = async ({ newComment: { id, callback, ...params }, parent = null }) => {
    const _params = Object.assign(params, { user: props.user });
    // 等待外部提交事件执行
    if (typeof props.beforeSubmit === 'function') {
      try {
        const data = transformToOriginObj(_params);
        const add = (data) => {
          addComment(id, comparePropsAndValues(data));
          callback();
        };
        await props.beforeSubmit(data, parent, add);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleCommentLike = async ({ id, comment: { children, ...params } }) => {
    const _params = Object.assign(params, { user: props.user });
    if (typeof props.beforeLike === 'function') {
      try {
        await props.beforeLike(transformToOriginObj(_params));

        storeLikes(id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  /**
   * 删除评论或回复
   */
  const handleCommentDelete = async ({ id, comment, parent = null }) => {
    if (typeof props.beforeDelete === 'function') {
      try {
        const data = transformToOriginObj(comment);
        ElMessageBox.confirm(t('delete.confirm'), t('common.tips'), {
          confirmButtonText: t('button.confirm'),
          cancelButtonText: t('button.cancel'),
          type: 'warning',
          lockScroll: false,
        })
          .then(async () => {
            await props.beforeDelete(data, parent);

            deleteComment(id);
          })
          .catch(() => {});
      } catch (e) {
        console.error(e);
      }
    }
  };

  /**
   * 保存点赞
   */
  const storeLikes = (id) => {
    const { commentIndex, replyIndex } = getIndex(id);

    let comment = cacheData.value[commentIndex];

    if (!isNaN(replyIndex)) {
      comment = comment.children[replyIndex];
    }

    comment.liked = !comment.liked;

    if (comment.likes) {
      comment.liked ? comment.likes++ : comment.likes--;
    } else {
      comment.likes = 1;
    }

    const data = cacheData.value.map(transformToOriginObj);

    // console.log('storeLikes--->' + JSON.stringify(data));
    emits('input', data);
  };

  /**
   * 存储新评论或回复
   */
  const addComment = (id, rawData) => {
    const { commentIndex } = getIndex(id);

    // 更新视图
    if (commentIndex === 'root') {
      cacheData.value.unshift(rawData);
    } else {
      const comment = cacheData.value[commentIndex];
      comment.children.push(rawData);
    }

    // 滚动至可见视图上
    const signal =
      commentIndex === 'root'
        ? 0
        : `${commentIndex}-${cacheData.value[commentIndex].children.length - 1}`;
    scrollIntoView(`comment-${signal}`);

    // 更新外部数据
    const data = cacheData.value.map(transformToOriginObj);
    // console.log('addComment--->' + JSON.stringify(data));
    emits('input', data);
  };

  /**
   * 删除评论或回复
   */
  const deleteComment = (id) => {
    const { commentIndex, replyIndex } = getIndex(id);

    cacheData.value = cacheData.value.filter((c, i) => {
      if (isNaN(replyIndex)) {
        return i !== commentIndex;
      } else {
        c.children = c.children.filter((r, j) => j !== replyIndex);
        return c;
      }
    });

    const data = cacheData.value.map(transformToOriginObj);

    // console.log('deleteComment--->' + JSON.stringify(data));
    emits('input', data);
  };

  /**
   * 向下递归触发表单blur事件
   */
  const broadcastBlur = (target, id) => {
    if (id && target?.id === id) return;

    if (Array.isArray(target)) {
      target.map((c) => broadcastBlur(c, id));
    } else {
      const children = target?.$refs;
      children && broadcastBlur(children, id);

      const richInput = target?.$refs['rich-input'];
      richInput && richInput.blur();
    }
  };

  /**
   * 从id中提取出序号
   */
  const getIndex = (id) => {
    const [, c, r] = id.split('-');
    return { commentIndex: c === 'root' ? c : +c, replyIndex: +r };
  };

  /**
   * 将子组件滚动到视图可见区域
   */
  const scrollIntoView = (tmp) => {
    nextTick(() => {
      proxy?.$refs[tmp][0].$el.scrollIntoView(false);
    });
  };

  const onError = (e: Event) => {
    (<HTMLImageElement>e.target).classList.add('error');
  };

  /**
   * 监听窗口宽度，当小于600时，将评论列表宽度设置为narrow
   */
  const checkDivWidth = () => {
    if (commentRef.value) {
      isNarrow.value = commentRef.value.offsetWidth <= 600;
    }
  };

  /**
   * 监听窗口宽度变化
   */
  const handleResize = () => {
    checkDivWidth();
  };

  onMounted(() => {
    checkDivWidth();
    window.addEventListener('resize', handleResize);

    const unwatch = watchEffect(() => {
      processData();
    });
    if (cacheData.value.length > 0) {
      unwatch();
    }
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
  });
</script>
<style scoped lang="scss">
  #comment {
    // border-top: 1px solid #ebebeb;
    padding-top: 1.0664rem;
    & > .comment-form {
      margin: 0 1.3328rem 1.0664rem;
    }
    & > .comment-list {
      margin: 0 1.3328rem 0 5.2rem;
      background-color: #fff;
    }
    & > .comment-list > .sub-comment-list {
      margin: 0.8rem 0;
      padding: 0 0 0 0.8rem;
      background-color: #fafbfc;
      border-radius: 3px;
      .comment-item {
        margin-bottom: 0;
        &:last-child .content-box {
          border-bottom: none;
        }
        .comment {
          position: relative;
          padding: 0.8rem 0 0;
          .content-box {
            margin-right: 0.8rem;
            padding-bottom: 0.8rem;
          }
        }
      }
    }

    :deep(img) {
      user-select: none;
      -webkit-user-drag: none;
      &.avatar {
        width: 2.1336rem;
        height: 2.1336rem;
        border-radius: 50%;
        cursor: pointer;
      }
      &.error {
        display: inline-block;
        transform: scale(0.5);
        content: '';
        color: transparent;
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 1px solid #e7e7e7;
          box-sizing: border-box;
          transform: scale(2);
          background: #f5f5f5
            url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M304.128 456.192c48.64 0 88.064-39.424 88.064-88.064s-39.424-88.064-88.064-88.064-88.064 39.424-88.064 88.064 39.424 88.064 88.064 88.064zm0-116.224c15.36 0 28.16 12.288 28.16 28.16s-12.288 28.16-28.16 28.16-28.16-12.288-28.16-28.16 12.288-28.16 28.16-28.16z' fill='%23e6e6e6'/%3E%3Cpath d='M887.296 159.744H136.704C96.768 159.744 64 192 64 232.448v559.104c0 39.936 32.256 72.704 72.704 72.704h198.144L500.224 688.64l-36.352-222.72 162.304-130.56-61.44 143.872 92.672 214.016-105.472 171.008h335.36C927.232 864.256 960 832 960 791.552V232.448c0-39.936-32.256-72.704-72.704-72.704zm-138.752 71.68v.512H857.6c16.384 0 30.208 13.312 30.208 30.208v399.872L673.28 408.064l75.264-176.64zM304.64 792.064H165.888c-16.384 0-30.208-13.312-30.208-30.208v-9.728l138.752-164.352 104.96 124.416-74.752 79.872zm81.92-355.84l37.376 228.864-.512.512-142.848-169.984c-3.072-3.584-9.216-3.584-12.288 0L135.68 652.8V262.144c0-16.384 13.312-30.208 30.208-30.208h474.624L386.56 436.224zm501.248 325.632c0 16.896-13.312 30.208-29.696 30.208H680.96l57.344-93.184-87.552-202.24 7.168-7.68 229.888 272.896z' fill='%23e6e6e6'/%3E%3C/svg%3E")
            no-repeat center / 50% 50%;
        }
      }
    }
  }

  @media screen and (max-width: 600px) {
    #comment {
      & > .comment-list {
        margin: 0 1.6rem;
      }
      & > .comment-form {
        margin: 1rem 1.6rem;
      }
      & > :deep(.comment-root .avatar-box) {
        display: none;
      }
    }
  }

  .narrow {
    .comment-form {
      margin: 0 1rem 1.6rem !important;
    }
    .comment-list {
      margin: 0 1rem !important;
    }
    :deep(.comment-root .avatar-box) {
      display: none !important;
    }
  }
</style>
