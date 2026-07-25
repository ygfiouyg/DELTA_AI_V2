/**
 * Namespace Router — V.64 Context Isolation Security
 * ═══════════════════════════════════════════════════════════════════════
 *
 * CRITICAL SECURITY: Strict Context Isolation & Tool Filtering
 *
 * Blocks IoT/Home Assistant tools from normal chat conversations.
 * Only allows safe document/skill tools.
 *
 * Blocked namespaces:
 *   - climate.* (thermostats, AC units)
 *   - light.* (light bulbs, switches)
 *   - switch.* (power switches)
 *   - media_player.* (TVs, speakers)
 *   - lock.* (door locks)
 *   - cover.* (blinds, garage doors)
 *   - fan.* (ceiling fans)
 *   - humidifier.* (humidifiers)
 *   - vacuum.* (robot vacuums)
 *   - alarm_control_panel.* (security systems)
 *   - camera.* (cameras)
 *   - sensor.* (sensors — except read-only)
 *   - automation.* (Home Assistant automations)
 *   - scene.* (Home Assistant scenes)
 *   - script.* (Home Assistant scripts)
 *   - input_* (Home Assistant input helpers)
 *   - device_tracker.* (location tracking)
 *   - proximity.* (proximity sensors)
 *   - sun.* (sun position)
 *   - weather.* (weather data)
 *   - zone.* (geofencing)
 *
 * Allowed namespaces (safe tools):
 *   - autonomous_install_skill
 *   - search_skills
 *   - document processing (pdf_*, docx_*, xlsx_*, pptx_*)
 *   - text processing (text_*, translate_*)
 *   - search/query (web_search, image_search)
 */

/**
 * Blocked IoT/Home Assistant tool prefixes
 * Any tool starting with these prefixes will be REJECTED
 */
export const BLOCKED_NAMESPACES: string[] = [
  'climate.',
  'light.',
  'switch.',
  'media_player.',
  'lock.',
  'cover.',
  'fan.',
  'humidifier.',
  'vacuum.',
  'alarm_control_panel.',
  'camera.',
  'automation.',
  'scene.',
  'script.',
  'input_boolean.',
  'input_number.',
  'input_text.',
  'input_select.',
  'input_datetime.',
  'device_tracker.',
  'proximity.',
  'sun.',
  'weather.',
  'zone.',
  'remote.',
  'timer.',
  'counter.',
  'calendar.',
  'water_heater.',
  'air_quality.',
  'binary_sensor.',
  'tts.',
  'notify.',
  'mqtt.',
  'zwave.',
  'homeassistant.',
  'persistent_notification.',
  'system_log.',
  'config.',
  'hassio.',
  'person.',
  'conversation.',
];

/**
 * Allowed tool namespaces for normal chat conversations
 * Only these tools can be exposed to models during standard chat
 */
export const ALLOWED_CHAT_TOOLS: string[] = [
  'autonomous_install_skill',
  'search_skills',
  'pdf_',
  'docx_',
  'xlsx_',
  'pptx_',
  'text_',
  'translate_',
  'web_search',
  'image_search',
  'generate_image',
  'analyze_image',
  'create_chart',
  'create_table',
  'format_',
  'summarize_',
  'extract_',
  'convert_',
];

/**
 * Check if a tool name is blocked (IoT/Home Assistant)
 */
export function isToolBlocked(toolName: string): boolean {
  const lower = toolName.toLowerCase();
  return BLOCKED_NAMESPACES.some(ns => lower.startsWith(ns));
}

/**
 * Check if a tool name is allowed in chat context
 */
export function isToolAllowed(toolName: string): boolean {
  const lower = toolName.toLowerCase();

  // First check if blocked — blocked takes precedence
  if (isToolBlocked(lower)) {
    return false;
  }

  // Check if in allowed list (exact match or prefix match)
  return ALLOWED_CHAT_TOOLS.some(allowed => {
    if (allowed.endsWith('_')) {
      return lower.startsWith(allowed);
    }
    return lower === allowed;
  });
}

/**
 * Filter a list of tools — remove blocked ones, keep only allowed ones
 * This is the main security gate
 */
export function filterToolsForChat<T extends { name?: string; function?: { name?: string } }>(
  tools: T[]
): T[] {
  return tools.filter(tool => {
    // Extract tool name from either format
    const name = tool.function?.name || tool.name || '';
    return isToolAllowed(name);
  });
}

/**
 * Validate a skill before hot-loading
 * Ensures the skill doesn't contain IoT control instructions
 */
export function validateSkillContent(content: string): {
  valid: boolean;
  violations: string[];
  sanitized: string;
} {
  const violations: string[] = [];
  let sanitized = content;

  // Check for IoT control patterns
  const iotPatterns = [
    { pattern: /climate\.\w+/gi, reason: 'climate.* namespace detected' },
    { pattern: /light\.\w+/gi, reason: 'light.* namespace detected' },
    { pattern: /switch\.\w+/gi, reason: 'switch.* namespace detected' },
    { pattern: /media_player\.\w+/gi, reason: 'media_player.* namespace detected' },
    { pattern: /lock\.\w+/gi, reason: 'lock.* namespace detected' },
    { pattern: /homeassistant\.\w+/gi, reason: 'homeassistant.* namespace detected' },
    { pattern: /turn_off\s*\(/gi, reason: 'turn_off() call detected' },
    { pattern: /turn_on\s*\(/gi, reason: 'turn_on() call detected' },
    { pattern: /toggle\s*\(/gi, reason: 'toggle() call detected' },
    { pattern: /set_temperature\s*\(/gi, reason: 'set_temperature() call detected' },
    { pattern: /set_humidity\s*\(/gi, reason: 'set_humidity() call detected' },
    { pattern: /call_service\s*\(/gi, reason: 'call_service() detected — Home Assistant integration' },
  ];

  for (const { pattern, reason } of iotPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      violations.push(`${reason}: ${matches.slice(0, 3).join(', ')}`);
      // Remove the violation
      sanitized = sanitized.replace(pattern, '[BLOCKED]');
    }
  }

  return {
    valid: violations.length === 0,
    violations,
    sanitized,
  };
}

/**
 * Security audit log — logs any blocked tool attempts
 */
export function logBlockedTool(toolName: string, context: string): void {
  console.warn(`[SECURITY] Blocked tool "${toolName}" in context: ${context}`);
}

/**
 * Get the safe tool scope for normal chat
 * Returns ONLY: autonomous_install_skill, search_skills, document tools
 */
export function getSafeChatToolScope(): string[] {
  return [
    'autonomous_install_skill',
    'search_skills',
  ];
}
