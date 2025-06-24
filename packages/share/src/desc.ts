/** 解析描述 */
interface ParseStrategy {
  parse(desc: string): { title: string; enums: EnumItem[] } | undefined;
}

/** 正则匹配模式 */
class ParseByPattern implements ParseStrategy {
  parse(str: string) {
    if (!str) return;
    const parsingRules = [
      // 标题 枚举值-枚举标签 枚举值-枚举标签
      {
        pattern: /^([^:]+?)\s+(((\S+-\S+)\s*)*)$/,
        iFlag: /\s+/,
        vFlag: "-",
      },
      // 标题 枚举值:枚举标签 枚举值:枚举标签
      {
        pattern: /^([^:]+?)\s+(((\S+:\S+)\s*)*)$/,
        iFlag: /\s+/,
        vFlag: ":",
      },
      // 标题: 枚举值-枚举标签 枚举值-枚举标签
      {
        pattern: /^([^:]+?):\s+(((\S+-\S+)\s*)*)$/,
        iFlag: /\s+/,
        vFlag: "-",
      },
      // 标题: 枚举值 枚举标签; 枚举值 枚举标签;
      {
        pattern: /^([^:]+?):\s+(((\S+\s+\S+;)\s*)*)$/,
        iFlag: /;\s*/,
        vFlag: /\s+/,
      },
      // 标题 取值说明: 1 开发版本; 2 灰度版本; 3 正式版本;
      {
        pattern: /^([^:]+?)\s*取值说明:\s*(((\S+\s+\S+;)\s*)*)$/,
        iFlag: /;\s*/,
        vFlag: /\s+/,
      },
    ];

    // 预处理
    const desc = str
      .replace("：", ": ")
      .replace("，", ", ")
      .replace("；", "; ")
      .replace(/\n/g, " ");

    // 按规则解析
    for (const rule of parsingRules) {
      const match = desc.match(rule.pattern);
      if (!match) continue;

      const [, title, props] = match;
      const enums: EnumItem[] = [];
      props.split(rule.iFlag).map((item) => {
        const [value, label] = item.trim().split(rule.vFlag);
        if (value && label) {
          enums.push({ label, value });
        }
      });
      return { title, enums };
    }
  }
}

export type EnumItem = {
  label: string;
  value: any;
};

export type Enums = EnumItem[];

/** 描述解析 */
export function renderDesc(desc?: string): {
  title?: string;
  enums?: Enums;
} {
  if (!desc) return {};

  // 策略处理器
  const strategies: ParseStrategy[] = [new ParseByPattern()];

  // 按顺序尝试匹配策略
  for (const strategy of strategies) {
    const result = strategy.parse(desc);
    if (result) return result;
  }

  return { title: desc };
}
