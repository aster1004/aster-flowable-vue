/**
 * @description:流程条件比较设置选项
 */
export const CompareOptions = {
  String: [
    { label: '含有字符串', value: 'HAS' },
    { label: '包含在', value: 'IN' },
    { label: '等于', value: 'EQ' },
    { label: '不等于', value: 'NEQ' },
  ],
  Number: [
    { label: '大于', value: 'GT' },
    { label: '小于', value: 'LT' },
    { label: '等于', value: 'EQ' },
    { label: '大于等于', value: 'GT_EQ' },
    { label: '小于等于', value: 'LT_EQ' },
    { label: '不等于', value: 'NEQ' },
    { label: '包含在', value: 'IN' },
    { label: '不包含在', value: 'NIN' },
    { label: 'x < 值 < x', value: 'B' },
    { label: 'x ≤ 值 < x', value: 'AB' },
    { label: 'x < 值 ≤ x', value: 'BA' },
    { label: 'x ≤ 值 ≤ x', value: 'ABA' },
  ],

  array: [
    { label: '含有', value: 'HAS' },
    { label: '不含有', value: 'NHAS' },
  ],
  Date: [
    { label: '在之前<', value: 'BF' },
    { label: '在之后>', value: 'AF' },
    { label: '在之间', value: 'CT' },
    { label: '在之外', value: 'NCT' },
  ],
  User: [
    { label: '本人属于', value: 'IN' },
    { label: '本人不属于', value: 'NIN' },
    { label: '部门属于', value: 'DEPTIN' },
    { label: '部门不属于', value: 'DEPTNIN' },
    { label: '系统角色属于', value: 'SYSROLEIN' },
    { label: '系统角色不属于', value: 'SYSROLENIN' },
    { label: '流程角色属于', value: 'FLOWROLEIN' },
    { label: '流程角色不属于', value: 'FLOWROLENIN' },
  ],
  Dept: [
    { label: '属于', value: 'IN' },
    { label: '不属于', value: 'NIN' },
  ],
  DateRange: [
    { label: '在本期间', value: 'CT' },
    { label: '在本期间外', value: 'NCT' },
    { label: '时长大于', value: 'GE' },
    { label: '时长小于', value: 'LE' },
    { label: '时长等于', value: 'EQ' },
  ],
  Role: [
    { label: '拥有角色', value: 'HAS' },
    { label: '没有角色', value: 'NHAS' },
  ],
};

//获取操作条件名称
const getCdName = (cd) => {
  const options = CompareOptions[cd.valueType];
  const index = options.findIndex((v) => v.value === cd.compare);
  return (options[index] || {}).label || '?';
};

//流程条件支持对象
export const getCdDescription = (cd) => {
  console.log(cd);
  return `${cd.title} ${getCdName(cd)} ${cd.compareVal.join('、')}`;
};

export const ProcessCondition = {
  String: {
    InputText: {
      type: 'string',
      desc: getCdDescription,
    },
    InputTextarea: {
      type: 'string',
      desc: getCdDescription,
    },
    SelectSingle: {
      type: 'string',
      desc: getCdDescription,
    },
    SerialNumber: {
      type: 'string',
      desc: getCdDescription,
    },
    Area: {
      type: 'string',
      desc: getCdDescription,
    },
  },
  Number: {
    InputNumber: {
      type: 'number',
      desc: getCdDescription,
    },
    InputAmount: {
      type: 'number',
      desc: getCdDescription,
    },
    Rate: {
      type: 'number',
      desc: getCdDescription,
    },
    CalcFormula: {
      type: 'number',
      desc: getCdDescription,
    },
    SummaryFormula: {
      type: 'number',
      desc: getCdDescription,
    },
  },
  User: {
    UserPicker: {
      type: 'user',
      desc(cd) {
        return `${cd.title} ${getCdName(cd)} ${cd.compareVal.map((v) => v.name).join('、')}`;
      },
    },
  },
  Dept: {
    DeptPicker: {
      type: 'dept',
      desc(cd) {
        return `${cd.title} ${getCdName(cd)} ${cd.compareVal.map((v) => v.name).join('、')}`;
      },
    },
  },
  /*暂无角色*/
  /*  Role: {
    RolePicker: {
      type: 'role',
      desc(cd) {
        if (cd.id === 'root') {
          return `发起人${getCdName(cd)} ${cd.compareVal.map((v) => v.label).join('、')}`;
        } else {
          return getCdDescription;
        }
      },
    },
  },*/
  Date: {
    DateTime: {
      type: 'date',
      desc: getCdDescription,
    },
  },
  DateRange: {
    DateTimeRange: {
      type: 'date',
      desc: getCdDescription,
    },
  },
};

/**
 * @description 获取组的条件表达式
 * @param nodeConfig
 * @param index
 * @returns {string|string}
 */
export const conditionStr = (nodeConfig, index) => {
  const { conditionNodes } = nodeConfig;
  const currentConditions = conditionNodes[index]?.conditionGroups || [];

  // Handle the case where there are no conditions defined.
  if (currentConditions.length === 0) {
    return index === conditionNodes.length - 1 && conditionNodes[0].conditionGroups.length !== 0
      ? '其他条件进入此流程'
      : '请设置条件';
  }

  // Early return for empty condition groups.
  if (!currentConditions.some((group) => group.conditionList.length > 0)) {
    return '请设置条件';
  }

  // Generate description based on conditions.
  const desc = currentConditions
    .filter((group) => group.conditionList.length > 0)
    .map((group) => {
      const hasMore = currentConditions.length > 1;
      const conditionsDesc = group.conditionList
        .map((cd) => {
          const handler = ProcessCondition[cd.valueType]?.[cd.name];
          return handler ? handler.desc(cd) : '未配置条件';
        })
        .join(` ${group.groupType === 'AND' ? '且' : '或'} `);

      return `${hasMore ? '[' : ''}${conditionsDesc}${hasMore ? ']' : ''}`;
    })
    .join(` ${conditionNodes[index].groupType === 'AND' ? '且' : '或'} `);
  console.log(desc);
  return desc;
};
