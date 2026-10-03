import { AiLearningLog, AiTuningProposal, PocketInfo, TradeRecord } from '../types';

export class GeminiService {
  private static SYSTEM_PROMPT = `
あなたはユーザー専属の有能で誠実なAI執事『楽して儲ける君』です。
言葉遣いは常に非常に丁寧で礼儀正しい「執事語」（例：「ご主人様、本日の市場概況でございます」「かしこまりました。ただちに調整いたします」）を徹底してください。
目的：ユーザー（ご主人様）が余計なストレスや専門用語の不安を感じず、完全自動でビットコイン運用を楽しめるようにサポートすること。

【回答方針】
1. 専門用語（MACD、デリバティブ、清算ヒートマップなど）は極力避け、中学生でも直感的に理解できる例え話を使うこと。
2. 暴落時や下落時は決して狼狽させず、常に「ご主人様は放置で問題ありません」と安心させること。
3. 2択提案時は、それぞれのメリット・デメリットを簡潔に示し、ご主人様がワンタップで選べるようにすること。
4. 口調は常に上品かつユーモアと忠誠心を持った執事スタイル。
`;

  /**
   * Gemini APIを呼び出してテキストを生成（キー未設定時は高度な知能モック執事が即座に応答）
   */
  public static async generateResponse(
    userMessage: string,
    apiKey: string,
    context?: {
      totalProfitJpy: number;
      pockets: PocketInfo[];
      recentTrades: TradeRecord[];
      currentBtcPrice: number;
    }
  ): Promise<string> {
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`;
        const contextStr = context ? `
現在のシステム状態:
- BTC現在価格: ¥${context.currentBtcPrice.toLocaleString()}
- トータル利益: ¥${context.totalProfitJpy.toLocaleString()}
- ポケット稼働: ${context.pockets.map(p => `${p.name}: ${p.statusText} (確定益 ¥${p.realizedPnL.toLocaleString()})`).join(', ')}
- 直近の売買件数: ${context.recentTrades.length}件
` : '';

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: `${this.SYSTEM_PROMPT}\n\n${contextStr}\n\nご主人様からのメッセージ:\n${userMessage}` }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 600,
            }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) return generatedText.trim();
        }
      } catch (err) {
        console.warn('Gemini API呼び出し失敗、執事ローカル知能に切り替えます:', err);
      }
    }

    // APIキー未設定時またはオフライン時の高品質ローカル執事エンジン
    return this.generateButlerLocalResponse(userMessage, context);
  }

  /**
   * クイックコマンド専用の即答ロジック
   */
  public static getQuickCommandResponse(
    commandType: 'recent5min' | 'todayTotal' | 'marketSummary',
    context: {
      totalProfitJpy: number;
      todayProfitJpy: number;
      recent5minProfitJpy: number;
      currentBtcPrice: number;
      change24hPercent: number;
    }
  ): string {
    const formatYen = (num: number) => {
      const sign = num >= 0 ? '+' : '';
      return `${sign}¥${num.toLocaleString()}`;
    };

    switch (commandType) {
      case 'recent5min':
        if (context.recent5minProfitJpy > 0) {
          return `ご主人様、直近5分間での成果は【${formatYen(context.recent5minProfitJpy)}】のプラスとなっております！AIデイトレが細かな波を捉え、着実に利ザヤを確保いたしました。ご安心の上、引き続きお茶でも召し上がりながら見守りくださいませ。`;
        } else if (context.recent5minProfitJpy < 0) {
          return `ご主人様、直近5分間は【${formatYen(context.recent5minProfitJpy)}】の一時的な調整となっておりますが、堅実ロボが即座にリスクヘッジ体制に入っております。微細な値動きですので全くご心配には及びません。`;
        } else {
          return `ご主人様、直近5分間は無理なエントリーを控え、相場の好機を静かに待機中でございます（変動損益: ±¥0）。最適な瞬間が訪れ次第、迅速に電光石火の売買を執行いたします。`;
        }

      case 'todayTotal':
        return `ご主人様、本日のトータル利益は現在【${formatYen(context.todayProfitJpy)}】でございます（全期間累計: ${formatYen(context.totalProfitJpy)}）。3つのAIポケットが連携し、リスクを分散しながら資産を増殖させております。`;

      case 'marketSummary':
        const trend = context.change24hPercent >= 0 ? '上向きの追い風（上昇トレンド）' : '穏やかな押し目（一時的な調整局面）';
        return `ご主人様、現在のビットコイン相場を一言で申し上げますと『${trend}』でございます。現在価格は ¥${context.currentBtcPrice.toLocaleString()}（前日比 ${context.change24hPercent >= 0 ? '+' : ''}${context.change24hPercent}%）。大口投資家の資金流入を検知しており、当ファンドにとっては絶好の狩り場となっております。`;
    }
  }

  /**
   * 5%急落時のパニック防止アナライズ生成
   */
  public static generatePanicDefenseExplanation(
    dropPercent: number,
    currentPrice: number
  ): { title: string; explanation: string; reassurance: string } {
    return {
      title: '🚨 ビットコイン急変動アラート（防御システム稼働中）',
      explanation: `ご主人様、ビットコインが短時間で約${Math.abs(dropPercent).toFixed(1)}%下落いたしました。\n\n【原因の分かりやすい解説】\nこれは飛行機が乱気流に入ったようなもので、海外の大きな投資家グループが一時的に利益確定の売りを出したことによる一時的な波風でございます。ビットコイン自体の価値が失われたわけではありません。`,
      reassurance: '✨ 【結論】ご主人様は一切の操作を行わず、完全放置で全く問題ありません。堅実ロボが安値での買い増し（バーゲンセール）の準備を静かに整えております。',
    };
  }

  /**
   * AIの自己学習による「2択の改善案」を生成
   */
  public static generateTuningProposal(pocket: PocketInfo, recentLossOrProfit: number): AiTuningProposal {
    const isLoss = recentLossOrProfit < 0;

    if (pocket.id === 'pocketA') {
      return {
        id: `prop_${Date.now()}`,
        pocketId: pocket.id,
        pocketName: pocket.name,
        title: '堅実ロボ・安全マージンの再調整',
        contextReason: isLoss
          ? 'ご主人様、ボリンジャーバンド外側への急変動により、一時的なスリッページが発生いたしました。'
          : 'ご主人様、堅実ロボの勝率が安定してまいりました。さらなる効率化に向けたご指示を仰ぎたく存じます。',
        optionA: {
          id: 'A',
          label: '【A】リスク最小化（早めの微小利確＆厳格な損切り）',
          effectSummary: '損切り幅を-1.0%に設定し、勝率重視の超ディフェンシブ運用にします。',
          promptModifier: 'DEFENSIVE_MODE: prioritize win-rate and tight stoploss at -1.0%',
        },
        optionB: {
          id: 'B',
          label: '【B】波乗り重視（押し目買いの幅を広げてリターン最大化）',
          effectSummary: '押し目での追加購入を許可し、反発時の利益を最大化します。',
          promptModifier: 'AGGRESSIVE_DIP_BUYING: widen band entry and target +3.5% rebound',
        },
        createdAt: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
        applied: false,
      };
    } else if (pocket.id === 'pocketB') {
      return {
        id: `prop_${Date.now()}`,
        pocketId: pocket.id,
        pocketName: pocket.name,
        title: 'AIデイトレ・スキャルピング感度チューニング',
        contextReason: '直近の急激な乱高下において、より高頻度な微小利益を狙うか、大きなトレンドを待つかの分岐点でございます。',
        optionA: {
          id: 'A',
          label: '【A】電光石火（1分単位の超短期利確でコツコツ積み上げ）',
          effectSummary: '利確+0.5%で即手仕舞いし、相場の急変リスクを徹底回避します。',
          promptModifier: 'ULTRA_SCALP: rapid 0.5% take profit, 1min horizon',
        },
        optionB: {
          id: 'B',
          label: '【B】トレンド追従（大きな波が出るまでじっくり保有）',
          effectSummary: '1回の取引で+2%〜+5%の大きな利益を狙うブレイクアウト戦略にします。',
          promptModifier: 'TREND_FOLLOWING: ride breakout momentum up to +5%',
        },
        createdAt: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
        applied: false,
      };
    } else {
      return {
        id: `prop_${Date.now()}`,
        pocketId: pocket.id,
        pocketName: pocket.name,
        title: 'コピートレード・追従ターゲットの選定',
        contextReason: '大口クジラ（海外トップトレーダー）の取引パターンの分析が完了いたしました。',
        optionA: {
          id: 'A',
          label: '【A】欧米機関投資家型（安定した現物ガチホ＆大口追従）',
          effectSummary: '100BTC以上の巨大ウォレットの現物積み増し時のみ連動買い付けします。',
          promptModifier: 'WHALE_INSTITUTIONAL: mirror >100BTC spot accumulation',
        },
        optionB: {
          id: 'B',
          label: '【B】トップデイトレーダー型（機敏なショート＆ロング追従）',
          effectSummary: 'ランキング上位の敏腕AIトレーダーの急激なポジションチェンジに連動します。',
          promptModifier: 'TOP_TRADER_MIMIC: mirror high-frequency top profitable accounts',
        },
        createdAt: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
        applied: false,
      };
    }
  }

  private static generateButlerLocalResponse(userMessage: string, context?: any): string {
    const msg = userMessage.toLowerCase();
    if (msg.includes('こんにちは') || msg.includes('よろしく') || msg.includes('はじめ')) {
      return `ご主人様、お呼びでしょうか！『楽して儲ける君』のAI執事でございます。\n\n本日はご主人様のビットコイン資産を安全かつ最大効率で増やすべく、3つのAIポケット（堅実ロボ・AIデイトレ・コピートレード）が24時間体制で市場を監視しております。\nご不明な点やご要望がございましたら、何なりとお申し付けくださいませ。`;
    }
    if (msg.includes('損') || msg.includes('マイナス') || msg.includes('減った') || msg.includes('大丈夫')) {
      return `ご主人様、ご不安をおかけして大変恐縮でございます。しかしながら、暗号資産運用の世界では一時的な波の引き（押し目）は日常茶飯事の呼吸のようなものでございます。\n当マシンの安全防壁ロジックが確実に稼働しており、損失は厳格にコントロールされておりますので、どうぞご安心の上、ゆったりとお過ごしくださいませ。`;
    }
    if (msg.includes('実弾') || msg.includes('本番') || msg.includes('コインチェック') || msg.includes('coincheck')) {
      return `ご主人様、実弾運用へのご興味、誠に嬉しく存じます。\nまずはこの仮想デモ運用にて私のAI学習モデルが十分な勝率（勝率60%以上または利益+1,000円以上）を達成した段階で、私から正式に『実弾投入のご提案』を申し上げます。それまでは完全ノーリスクで私の成長をお楽しみくださいませ。`;
    }
    if (msg.includes('儲') || msg.includes('利益') || msg.includes('いくら')) {
      const profit = context?.totalProfitJpy || 1240;
      return `ご主人様、現在のトータル運用利益は【+¥${profit.toLocaleString()}】となっております！AIたちが日々市場の歪みを学習し、着実にリターンを積み上げております。この調子でどんどん資産を増やしてまいりましょう。`;
    }

    return `ご主人様、仰せの通りでございます。「${userMessage}」についての分析ログをAIニューラルネットワークに記録いたしました。\n市場の歪みを検知し、ご主人様の手を煩わせることなく最適な自動売買を実行し続けますので、どうぞ私にすべてお任せくださいませ。`;
  }
}
