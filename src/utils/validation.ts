// Utility functions for data validation and business logic
export class ValidationUtils {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  }

  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  static validateBusinessMetrics(stats: { yearsInBusiness: number; projectsDelivered: number; referralPercentage: number }): {
    isValid: boolean;
    warnings: string[];
  } {
    const warnings: string[] = [];
    
    if (stats.yearsInBusiness < 0) {
      warnings.push('Years in business cannot be negative');
    }
    
    if (stats.projectsDelivered < 0) {
      warnings.push('Projects delivered cannot be negative');
    }
    
    if (stats.referralPercentage < 0 || stats.referralPercentage > 100) {
      warnings.push('Referral percentage must be between 0 and 100');
    }
    
    if (stats.yearsInBusiness > 0 && stats.projectsDelivered / stats.yearsInBusiness > 50) {
      warnings.push('Projects per year seems unusually high');
    }

    return {
      isValid: warnings.length === 0,
      warnings
    };
  }
}
