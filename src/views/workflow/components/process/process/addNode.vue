<template>
  <div class="add-node-btn-box">
    <div class="add-node-btn">
      <el-popover placement="right-start" v-model="visible" width="auto">
        <div class="add-node-popover-body">
          <a class="add-node-popover-item approver" @click="addType(1)">
            <div class="item-wrapper">
              <span class="iconfont icon-shenpi"></span>
              <p>审批人</p>
            </div>
          </a>
          <a class="add-node-popover-item notifier" @click="addType(2)">
            <div class="item-wrapper">
              <span class="iconfont icon-chaosongwode"></span>
              <p>抄送人</p>
            </div>
          </a>
          <a class="add-node-popover-item condition" @click="addType(4, 'Exclusive')">
            <div class="item-wrapper">
              <span class="iconfont icon-bumen"></span>
              <p>条件分支</p>
            </div>
          </a>
          <a class="add-node-popover-item parallel" @click="addType(4, 'Parallel')">
            <div class="item-wrapper">
              <span class="iconfont icon-jiekou"></span>
              <p>并行分支</p>
            </div>
          </a>
          <a class="add-node-popover-item notifier" @click="addType(4, 'Inclusive')">
            <div class="item-wrapper">
              <span class="iconfont icon-liucheng1"></span>
              <p>包容分支</p>
            </div>
          </a>
        </div>
        <template #reference>
          <button class="btn" type="button">
            <span class="iconfont icon-xinzeng"></span>
          </button>
        </template>
      </el-popover>
    </div>
  </div>
</template>
<script setup>
  import { ref } from 'vue';
  import { isNotEmpty } from '@/utils/index';
  let props = defineProps({
    childNodeP: {
      type: Object,
      default: () => ({}),
    },
    parentId: {
      type: String,
      default: '',
    },
  });

  let emits = defineEmits(['update:childNodeP']);
  let visible = ref(false);
  // 定义常量以提高代码的可读性和易于维护
  const NODE_PREFIX = 'node_';
  const TYPE_AUDITOR = 1; // 审核人
  const TYPE_COPY = 2; // 抄送人
  const TYPE_EXCLUSIVE_CONDITION = 3; //路由 条件分支
  const TYPE_ROUTER = 4; //路由 条件分支
  const TYPE_PARALLEL_CONDITION = 5; // 并行分支
  const TYPE_INCLUSIVE_GATEWAY = 6; // 包容网关
  // 一个辅助函数，用于生成唯一的ID
  const generateUniqueId = () => {
    return NODE_PREFIX + new Date().getTime();
  };

  /**
   * 创建审核人和抄送人节点
   * @param type
   * @returns
   */
  const createBaseData = (type) => {
    switch (type) {
      case TYPE_AUDITOR:
        return {
          id: generateUniqueId(),
          nodeName: '审核人',
          error: true,
          type: 1,
          settype: 1,
          selectMode: 0,
          selectRange: 0,
          directorLevel: 1,
          examineMode: 1,
          noHanderAction: 1,
          examineEndDirectorLevel: 0,
          childNode: props.childNodeP,
          nodeUserList: [],
          parentId: props.parentId,
          error: false,
          errorTip: '',
          formPermission: [],
          buttonPermission: [
            {
              operation: '同意',
              name: 'agree',
              status: true,
            },
            {
              operation: '不同意',
              name: 'disagree',
              status: true,
            },
            {
              operation: '撤销',
              name: 'revoke',
              status: true,
            },
            {
              operation: '转交',
              name: 'forward',
              status: true,
            },
            {
              operation: '加签',
              name: 'addNode',
              status: true,
            },
          ],
          noUser: 'autoPass',
          approveType: 'togetherCountersign',
        };
      case TYPE_COPY:
        return {
          id: generateUniqueId(),
          nodeName: '抄送人',
          type: TYPE_COPY,
          error: false,
          errorTip: '',
          ccSelfSelectFlag: 1,
          childNode: props.childNodeP,
          nodeUserList: [],
          parentId: props.parentId,
        };
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  };

  /**
   * 创建网关节点，包括排他网关、包容网关和并行网关
   * @param typeName
   * @returns
   */
  const createRouterData = (typeName) => {
    switch (typeName) {
      case 'Exclusive':
        let exclusiveId = generateUniqueId();
        return {
          id: exclusiveId,
          parentId: props.parentId,
          nodeName: '路由',
          type: TYPE_ROUTER,
          childNode: null,
          typeName: 'Exclusive',
          conditionNodes: [
            {
              id: generateUniqueId(),
              parentId: exclusiveId,
              nodeName: '条件1',
              icon: 'iconfont icon-bumen',
              error: false,
              errorTip: '',
              type: TYPE_EXCLUSIVE_CONDITION,
              groupType: 'AND',
              isDefault: false, // 是否为默认节点，
              conditionGroups: [
                {
                  groupType: 'AND',
                  conditionList: [],
                },
              ],
              priorityLevel: 1,
              nodeUserList: [],
              childNode: props.childNodeP,
            },
            {
              id: generateUniqueId(),
              parentId: exclusiveId,
              nodeName: '默认条件',
              error: false,
              errorTip: '',
              icon: 'iconfont icon-bumen',
              type: TYPE_EXCLUSIVE_CONDITION,
              groupType: 'AND',
              isDefault: true, // 是否为默认节点，
              conditionGroups: [], // 默认条件暂时不加条件组
              priorityLevel: 2,
              nodeUserList: [],
              childNode: null,
            },
          ],
        };
      case 'Parallel':
        let parallelId = generateUniqueId();
        return {
          id: parallelId,
          parentId: props.parentId,
          nodeName: '路由',
          type: TYPE_ROUTER,
          childNode: null,
          typeName: 'Parallel',
          conditionNodes: [
            {
              id: generateUniqueId(),
              parentId: parallelId,
              nodeName: '并行分支1',
              icon: 'iconfont icon-jiekou',
              error: false,
              errorTip: '',
              type: TYPE_PARALLEL_CONDITION, // 分支节点类型
              nodeUserList: [],
              isDefault: false,
              priorityLevel: 1,
              childNode: props.childNodeP,
              // 其他属性...看，
            },
            {
              id: generateUniqueId(),
              parentId: parallelId,
              nodeName: '并行分支2',
              icon: 'iconfont icon-jiekou',
              type: TYPE_PARALLEL_CONDITION,
              nodeUserList: [],
              error: false,
              errorTip: '',
              isDefault: false,
              priorityLevel: 1,
              childNode: null,
              // 其他属性...
            },
          ],
        };
      case 'Inclusive':
        let inclusiveId = generateUniqueId();
        return {
          id: inclusiveId,
          parentId: props.parentId,
          nodeName: '包容网关',
          type: TYPE_ROUTER,
          childNode: props.childNodeP,
          typeName: 'Inclusive',
          conditionNodes: [
            {
              id: generateUniqueId(),
              parentId: inclusiveId,
              nodeName: '包容分支1',
              icon: 'iconfont icon-liucheng1',
              error: false,
              errorTip: '',
              type: TYPE_INCLUSIVE_GATEWAY,
              groupType: 'AND',
              isDefault: false, // 是否为默认节点，
              conditionGroups: [
                {
                  groupType: 'AND',
                  conditionList: [],
                },
              ],
              priorityLevel: 1,
              nodeUserList: [],
              childNode: props.childNodeP,
            },
            {
              id: generateUniqueId(),
              parentId: inclusiveId,
              nodeName: '默认条件',
              icon: 'iconfont icon-liucheng1',
              type: TYPE_INCLUSIVE_GATEWAY,
              groupType: 'AND',
              isDefault: true, // 是否为默认节点，
              conditionGroups: [], // 默认条件暂时不加条件组
              priorityLevel: 2,
              nodeUserList: [],
              childNode: null,
              error: false,
              errorTip: '',
            },
          ],
        };
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  };

  // 重构的addType函数
  const addType = (type, typeName = '') => {
    visible.value = false;
    try {
      let data;
      switch (type) {
        case TYPE_AUDITOR:
          data = createBaseData(TYPE_AUDITOR);
          emits('update:childNodeP', data);
          break;
        case TYPE_COPY:
          data = createBaseData(TYPE_COPY);
          emits('update:childNodeP', data);
          break;
        case TYPE_ROUTER: // 路由节点，包括排他：Exclusive、并行：Parallel 以及包容：INCLUSIVES
          if (isNotEmpty(typeName)) {
            switch (typeName) {
              case 'Exclusive':
                data = createRouterData('Exclusive');
                break;
              case 'Parallel':
                data = createRouterData('Parallel');
                break;
              case 'Inclusive':
                data = createRouterData('Inclusive');
                break;
              default:
                throw new Error(`Unsupported type: ${typeName}`);
            }
            emits('update:childNodeP', data);
          }
          break;

        default:
          throw new Error(`Unsupported type: ${type}`);
      }
    } catch (error) {
      console.error('Failed to add type:', error);
    }
  };
</script>
<style scoped lang="scss">
  .add-node-btn-box {
    width: 240px;
    display: inline-flex;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      margin: auto;
      width: 2px;
      height: 100%;
      background-color: #cacaca;
    }

    .add-node-btn {
      user-select: none;
      width: 240px;
      padding: 20px 0 32px;
      display: flex;
      -webkit-box-pack: center;
      justify-content: center;
      flex-shrink: 0;
      -webkit-box-flex: 1;
      flex-grow: 1;

      .btn {
        outline: none;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        width: 30px;
        height: 30px;
        background: $primary-color;
        // background: #3296fa;
        border-radius: 50%;
        position: relative;
        border: none;
        line-height: 30px;
        -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

        .iconfont {
          color: #fff;
          font-size: 16px;
        }

        &:hover {
          transform: scale(1.3);
          box-shadow: 0 13px 27px 0 rgba(0, 0, 0, 0.1);
        }

        &:active {
          transform: none;
          background: #1e83e9;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
</style>
<style lang="scss">
  .add-node-popover-body {
    display: flex;
    flex-wrap: wrap;
    width: 320px;
    .add-node-popover-item {
      padding: 5px 12px;
      cursor: pointer;
      width: 160px;
      height: 55px;
      text-align: center;
      color: #191f25 !important;

      .item-wrapper {
        padding: 0 10px;
        user-select: none;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        height: 40px;
        background: #fff;
        border-radius: 10px;
        border: 1px solid #e2e2e2;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        .iconfont {
          margin-right: 10px;
          font-size: 20px;
        }
      }

      &.approver {
        .item-wrapper {
          color: #f56c6c;
        }
      }

      &.notifier {
        .item-wrapper {
          color: #409eff;
        }
      }

      &.condition {
        .item-wrapper {
          color: #67c23a;
        }
      }
      &.parallel {
        .item-wrapper {
          color: #e6a23c;
        }
      }

      &:hover {
        .item-wrapper {
          background: $primary-color;
          color: #fff;
          box-shadow: 0px 3px 6px 0px var(--el-color-primary-light-6);
        }

        .iconfont {
          color: #fff;
        }
      }

      &:active {
        .item-wrapper {
          box-shadow: none;
          background: #eaeaea;
        }

        .iconfont {
          color: inherit;
        }
      }
    }
  }
</style>
