<template>
  <div class="w-full h-full">
    <aster-comment
      :data="commentData"
      :user="currentUser"
      :props="commentProps"
      :before-submit="submit"
      :before-like="like"
      :before-delete="deleteComment"
      :upload-img="uploadImg"
      @input="updateData"
    />
  </div>
</template>
<script setup lang="ts">
  import AsterComment from '@/components/comment/index.vue';
  import { onMounted, ref } from 'vue';
  import { useUserStore } from '@/stores/modules/user';
  import {
    commentAddApi,
    commentDeleteApi,
    commentLikeApi,
    commentTreeApi,
  } from '@/api/workflow/comment';
  import { ResultEnum } from '@/enums/httpEnum';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { uploadFile } from '@/api';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const userStore = useUserStore();

  const props = defineProps({
    procInstId: {
      type: String,
      default: '',
    },
  });

  /** 评论组件所需配置 */
  const commentProps = {
    id: 'id',
    content: 'content',
    imgSrc: 'imgSrc',
    children: 'children',
    likes: 'likes',
    liked: 'liked',
    reply: 'reply',
    createAt: 'createTime',
    user: 'user',
  };
  /** 评论数据 */
  const commentData = ref<Comment.CommentInfo[]>([]);
  /** 当前用户 */
  const currentUser = ref<{ id: string; name: string; avatar: string; isSuperAdmin: boolean }>({
    id: '',
    name: '',
    avatar: '',
    isSuperAdmin: false,
  });

  /**
   * 提交评论
   * @param newComment 新评论
   * @param parent 父级评论
   * @param add 添加评论
   */
  const submit = async (newComment, parent, add) => {
    console.log('submit--->');
    const addComment: Comment.CommentInfo = {
      content: newComment.content,
      parentId: parent ? parent.id : '0',
      replyId: newComment.reply ? newComment.reply.id : null,
      belongId: props.procInstId,
      imgSrc: newComment.imgSrc,
    };
    commentAddApi(addComment).then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        add(Object.assign(newComment, { _id: res.data }));
        console.log('addComment---success->', res.data);
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description 点赞
   * @param {*} comment 评论
   */
  const like = async (comment: Comment.CommentInfo) => {
    const params: Comment.CommentLike = {
      belongId: props.procInstId,
      commentId: comment.id!,
      liked: !comment.liked,
    };
    commentLikeApi(params).then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        console.log('like---success->', res.message);
      } else {
        console.log('like---error--->', res.message);
      }
    });
  };

  /**
   * @description 上传图片
   * @param {*} file 文件
   * @param {*} callback 回调
   */
  const uploadImg = async ({ file, callback }) => {
    const formData = new FormData();
    formData.append('file', file);
    await uploadFile(formData).then((res) => {
      if (res.code === ResultEnum.SUCCESS) {
        callback(res.data.url);
      } else {
        ElMessage.error(res.message);
      }
    });
  };
  /**
   * @description: 删除评论
   * @param {*} comment 评论
   * @param {*} parent 父级评论
   * @return {*}
   */
  const deleteComment = async (comment, parent) => {
    commentDeleteApi([comment.id]).then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        console.log('deleteComment---success->', res.message);
      } else {
        ElMessage.error(res.message);
      }
    });
  };

  /**
   * @description: 更新评论数据
   * @return {*}
   */
  const updateData = (res) => {
    commentData.value = res;
  };

  /**
   * @description: 查询评论数据
   * @return {*}
   */
  const handleQuery = () => {
    commentTreeApi(props.procInstId).then((res) => {
      if (res.code == ResultEnum.SUCCESS) {
        commentData.value = res.data;
      }
    });
  };

  onMounted(() => {
    // 当前用户信息
    currentUser.value = {
      id: userStore.userInfo.id,
      name: userStore.displayName,
      avatar: userStore.userInfo.avatar ? userStore.userInfo.avatar : '',
      isSuperAdmin: userStore.isSuperAdmin,
    };
    // 查询评论数据
    handleQuery();
  });
</script>
<style scoped lang="scss"></style>
