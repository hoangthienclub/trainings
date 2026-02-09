/**
 * Saga Orchestrator - Quản lý các bước trong một saga transaction
 * 
 * Saga Pattern là một pattern để quản lý distributed transactions
 * bằng cách chia nhỏ transaction thành các bước tuần tự,
 * mỗi bước có một compensation action để rollback nếu cần.
 */

export class SagaOrchestrator {
  constructor() {
    this.steps = [];
    this.executedSteps = [];
    this.compensations = [];
  }

  /**
   * Thêm một bước vào saga
   * @param {Function} action - Hàm thực thi bước này
   * @param {Function} compensation - Hàm rollback nếu bước này đã được thực thi
   * @param {string} name - Tên của bước (để logging)
   */
  addStep(action, compensation, name) {
    this.steps.push({
      action,
      compensation,
      name: name || `Step ${this.steps.length + 1}`,
    });
    return this;
  }

  /**
   * Thực thi saga - chạy tất cả các bước tuần tự
   * Nếu một bước fail, sẽ rollback tất cả các bước đã thực thi
   */
  async execute(context = {}) {
    this.executedSteps = [];
    this.compensations = [];

    console.log('\n🚀 Bắt đầu thực thi Saga...\n');

    try {
      // Thực thi từng bước
      for (let i = 0; i < this.steps.length; i++) {
        const step = this.steps[i];
        console.log(`📝 Đang thực thi: ${step.name}`);

        try {
          // Thực thi action
          const result = await step.action(context);

          // Chỉ push compensation SAU KHI action thành công.
          // Lý do: Chỉ cần rollback những bước đã hoàn thành. Bước đang chạy mà lỗi
          // thì chưa hoàn thành → không cần (và không nên) chạy compensation cho nó.
          // VD: Step 1,2 OK → có [comp1, comp2]. Step 3 lỗi → compensate() chạy comp2, comp1 là đủ.
          this.executedSteps.push(i);
          this.compensations.push({
            compensation: step.compensation,
            name: step.name,
            context: { ...context },
          });

          // Cập nhật context với kết quả
          if (result) {
            Object.assign(context, result);
          }

          console.log(`✅ Hoàn thành: ${step.name}\n`);
        } catch (error) {
          console.error(`❌ Lỗi tại ${step.name}:`, error.message);
          throw error;
        }
      }

      console.log('🎉 Saga hoàn thành thành công!\n');
      return { success: true, context };

    } catch (error) {
      console.error('\n⚠️  Saga thất bại, bắt đầu rollback...\n');
      
      // Rollback các bước đã thực thi (theo thứ tự ngược lại)
      await this.compensate();

      return { 
        success: false, 
        error: error.message, 
        context 
      };
    }
  }

  /**
   * Thực thi compensation cho tất cả các bước đã thực thi
   * (theo thứ tự ngược lại - LIFO)
   */
  async compensate() {
    // Đảo ngược mảng để rollback từ bước cuối về bước đầu
    const reversedCompensations = [...this.compensations].reverse();

    for (const comp of reversedCompensations) {
      try {
        console.log(`🔄 Đang rollback: ${comp.name}`);
        await comp.compensation(comp.context);
        console.log(`✅ Rollback thành công: ${comp.name}\n`);
      } catch (compError) {
        console.error(`❌ Lỗi khi rollback ${comp.name}:`, compError.message);
        // Tiếp tục rollback các bước khác dù có lỗi
      }
    }

    console.log('✅ Hoàn thành rollback\n');
  }
}
