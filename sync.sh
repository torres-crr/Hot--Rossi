#!/bin/bash
echo "🔄 Sincronizando com GitHub..."
git add .
git commit -m "Atualização automática: $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main
echo "✅ Tudo salvo no GitHub!"
