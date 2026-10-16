import fs from 'fs';
import path from 'path';

const geminiConfigDir = "C:\\Users\\zaqq1\\.gemini\\config";
const geminiSkillsDir = path.join(geminiConfigDir, "skills");
const nxaBase = "c:\\Users\\zaqq1\\.codex\\.chatgpt-projects\\g-p-6a6a31087fe88191af175635469408c9\\nxa-skills-engine";

console.log("=== NXA SKILLS ENGINE -> ANTIGRAVITY SYNC ===");

// 1. Identify all skills in nxa-skills-engine
const categories = ['core', 'frontend', 'ui-ux', 'motion', 'three-d', 'backend', 'mobile', 'ai', 'quality', 'workflows'];
const nxaSkills = [];

for (const cat of categories) {
  const catDir = path.join(nxaBase, cat);
  if (!fs.existsSync(catDir)) continue;
  const entries = fs.readdirSync(catDir, { withFileTypes: true });
  for (const ent of entries) {
    if (ent.isDirectory()) {
      const skillFile = path.join(catDir, ent.name, 'SKILL.md');
      if (fs.existsSync(skillFile)) {
        const content = fs.readFileSync(skillFile, 'utf-8');
        const nameMatch = content.match(/name:\s*([^\r\n]+)/);
        const skillName = nameMatch ? nameMatch[1].trim() : ent.name;
        nxaSkills.push({
          sourceDir: path.join(catDir, ent.name),
          skillName,
          category: cat
        });
      }
    }
  }
}

console.log(`Found ${nxaSkills.length} NXA skills ready for deployment.`);

// 2. Deploy to ~/.gemini/config/skills/<skillName>/
let installedCount = 0;
let preservedCount = 0;

for (const s of nxaSkills) {
  const destDir = path.join(geminiSkillsDir, s.skillName);
  if (fs.existsSync(destDir)) {
    // Check if it's already an existing legacy or non-NXA skill
    preservedCount++;
  } else {
    fs.mkdirSync(destDir, { recursive: true });
    // Copy SKILL.md and any subdirectories
    fs.copyFileSync(path.join(s.sourceDir, 'SKILL.md'), path.join(destDir, 'SKILL.md'));
    installedCount++;
  }
}

console.log(`Successfully installed ${installedCount} new skills directly to ${geminiSkillsDir}`);
console.log(`Preserved ${preservedCount} existing skills to prevent overwrites.`);

// 3. Configure ~/.gemini/config/skills.json for explicit discovery
const skillsJsonPath = path.join(geminiConfigDir, 'skills.json');
const entries = categories.map(cat => ({
  path: path.join(nxaBase, cat).replace(/\\/g, '/')
}));

const skillsJsonContent = {
  description: "NXA Skills Engine Manifest for Google Antigravity",
  entries: entries
};

fs.writeFileSync(skillsJsonPath, JSON.stringify(skillsJsonContent, null, 2), 'utf-8');
console.log(`Updated ${skillsJsonPath} with all 10 modular NXA categories.`);

console.log("=== SYNC COMPLETED SUCCESSFULLY ===");
