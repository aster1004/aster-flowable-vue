<template>
  <div class="comment-item" :class="{ 'sub-comment-item': isSubComment }">
    <div class="comment">
      <!-- 评论或回复人头像 -->
      <img class="avatar" :src="comment.user.avatar || defaultAvatar" @error="onError($event)" />
      <div class="comment-box">
        <!-- 评论或回复人具体信息 -->
        <div class="meta-box">
          <slot name="userMeta">
            <div class="user-popover-box">
              <span v-if="comment.user">
                {{ comment.user.name + (comment.user.id === user.id ? '（作者）' : '') }}
              </span>
            </div>
          </slot>
        </div>

        <!-- 评论或回复内容 -->
        <div class="content">
          <span v-if="comment.reply" class="reply">
            回复
            <span class="reply-target" :title="comment.reply.email">
              {{ comment.reply.name + '：' }}
            </span>
          </span>
          {{ comment.content }}
          <div v-if="comment.imgSrc" class="img-box">
            <img :src="comment.imgSrc || ''" @error="onError($event)" />
          </div>
        </div>

        <!-- 评论或回复时间及操作 -->
        <div class="reply-stat">
          <!-- 时间 -->
          <time :title="formatTime(comment.createAt, true)" :datetime="comment.createAt">
            {{ formatTime(comment.createAt) }}
          </time>
          <!-- 删除 -->
          <div
            v-if="user.isSuperAdmin || user.id === comment.user.id"
            class="delete"
            @click.stop="onDelete"
          >
            <span>·</span>删除
          </div>
          <!-- 点赞 -->
          <div class="action-box">
            <div
              class="like-action action"
              :class="{ active: comment.liked }"
              @click.stop="onLiked"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" class="icon like-icon">
                <g fill="none" fill-rule="evenodd">
                  <path d="M0 0h20v20H0z" />
                  <path
                    :stroke="comment.liked ? '#37C700' : '#8A93A0'"
                    stroke-linejoin="round"
                    :fill="comment.liked ? '#37c700' : 'none'"
                    d="M4.58 8.25V17h-1.4C2.53 17 2 16.382 2 15.624V9.735c0-.79.552-1.485 1.18-1.485h1.4zM11.322 2c1.011.019 1.614.833 1.823 1.235.382.735.392 1.946.13 2.724-.236.704-.785 1.629-.785 1.629h4.11c.434 0 .838.206 1.107.563.273.365.363.84.24 1.272l-1.86 6.513A1.425 1.425 0 0 1 14.724 17H6.645V7.898C8.502 7.51 9.643 4.59 9.852 3.249A1.47 1.47 0 0 1 11.322 2z"
                  />
                </g>
              </svg>
              <span v-show="comment.likes" class="action-title">{{ comment.likes }}</span>
            </div>
            <div class="comment-action action" @mousedown.prevent="onReply" @click.prevent>
              <svg aria-hidden="true" viewBox="0 0 20 20" class="icon comment-icon">
                <g fill="none" fill-rule="evenodd">
                  <path d="M0 0h20v20H0z" />
                  <path
                    stroke="#8A93A0"
                    stroke-linejoin="round"
                    d="M10 17c-4.142 0-7.5-2.91-7.5-6.5S5.858 4 10 4c4.142 0 7.5 2.91 7.5 6.5 0 1.416-.522 2.726-1.41 3.794-.129.156.41 3.206.41 3.206l-3.265-1.134c-.998.369-2.077.634-3.235.634z"
                  />
                </g>
              </svg>
              <span class="action-title">回复</span>
            </div>
          </div>
        </div>

        <!-- 评论表单组件 -->
        <slot :id="id" />

        <!-- 回复列表 -->
        <slot name="subList" :parentId="id" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { computed } from 'vue';
  import defaultAvatar from '@/assets/images/avatar.png';

  const props = defineProps({
    comment: {
      type: Object,
      default: () => {},
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    parent: {
      type: Object,
      default: () => {},
    },
    user: {
      type: Object,
      default: () => {},
    },
  });

  const emits = defineEmits(['comment-delete', 'comment-like', 'comment-reply']);

  const isSubComment = computed(() => {
    return props.id.split('-').length === 3;
  });

  const formatTime = (time, local = false) => {
    const d = new Date(time);

    if (local) {
      return d.toString();
    }

    const now = Date.now();
    const diff = (now - d.getTime()) / 1000;

    switch (true) {
      case diff < 30:
        return '刚刚';
      case diff < 3600:
        return Math.ceil(diff / 60) + '分钟前';
      case diff < 3600 * 24:
        return Math.ceil(diff / 3600) + '小时前';
      case diff < 3600 * 24 * 30:
        return Math.floor(diff / 3600 / 24) + '天前';
      case diff < 3600 * 24 * 365:
        return Math.floor(diff / 3600 / 24 / 30) + '月前';
      default:
        return Math.floor(diff / 3600 / 24 / 365) + '年前';
    }
  };

  const onError = (e: Event) => {
    (<HTMLImageElement>e.target).classList.add('error');
  };

  const onDelete = () => {
    emits('comment-delete', { id: props.id, comment: props.comment, parent: props.parent });
  };

  const onLiked = () => {
    emits('comment-like', { id: props.id, comment: props.comment });
  };

  const onReply = () => {
    emits('comment-reply', props.id);
  };
</script>
<style scoped lang="scss">
  .comment-item {
    margin-bottom: 1.0664rem;
    &:not(:last-child) {
      .comment-box {
        border-bottom: 1px solid #f1f1f1;
      }
    }
    &:hover {
      .comment .reply-stat .delete {
        visibility: visible;
      }
    }
    .comment {
      display: flex;
      .comment-box {
        margin-left: 0.6664rem;
        flex: 1 1 auto;
        &.focus {
          padding-bottom: 0.4rem;
        }
        .meta-box {
          display: flex;
          align-items: center;
          font-size: 0.8664rem;
          line-height: 1.25;
          white-space: nowrap;
          .user-popover-box {
            cursor: pointer;
          }
        }
        .content {
          margin-top: 0.44rem;
          font-size: 0.8664rem;
          line-height: 1.4664rem;
          white-space: pre-line;
          word-break: break-all;
          color: #505050;
          overflow: hidden;
          .img-box {
            margin-top: 0.5rem;
            img {
              max-width: 100%;
              max-height: 20rem;
              object-fit: cover;
            }
          }
          .reply {
            vertical-align: top;
          }
          .reply-target {
            cursor: pointer;
            color: #406599;
          }
        }
      }
      .reply-stat {
        display: flex;
        margin-top: 7px;
        font-weight: 400;
        time,
        .delete {
          font-size: 0.8664rem;
          color: #8a9aa9;
        }
        .delete {
          visibility: hidden;
          cursor: pointer;
          span {
            margin: 0 0.2rem;
          }
        }
        .action-box {
          flex: 0 0 auto;
          display: flex;
          justify-content: space-between;
          margin-left: auto;
          min-width: 7.04rem;
          color: #8a93a0;
          user-select: none;
          .action {
            display: flex;
            align-items: center;
            margin-left: 0.4rem;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
            &.active {
              color: #37c700;
            }
            .icon {
              min-width: 16.5px;
              min-height: 16.5px;
              width: 0.8rem;
              height: 0.8rem;
            }
            .action-title {
              margin-left: 0.2rem;
              font-size: 0.8rem;
            }
          }
        }
      }
    }
  }

  .sub-comment-list {
    margin: 0.8rem 0;
    padding: 0 0 0 0.8rem;
    background-color: #fafbfc;
    border-radius: 3px;
    .comment-item {
      margin-bottom: 0;
      &:last-child .comment-box {
        border-bottom: none;
      }
      .comment {
        position: relative;
        padding: 0.8rem 0 0;

        .comment-box {
          margin-right: 0.8rem;
          padding-bottom: 0.8rem;
        }
      }
    }
  }
</style>
