const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

let ticketCount = 0; // 🔢 contador de tickets

client.once('ready', () => {
  console.log('Bot online!');
});


// 📢 PAINEL
client.on('messageCreate', async (message) => {
  if (message.content === '!ticket') {

    const embed = new EmbedBuilder()
      .setTitle('🎟️ Central de Atendimento - Infectus')
      .setDescription('Escolha uma categoria abaixo para abrir seu ticket.')
      .setColor('#28361b')
      .setFooter({ text: 'Infectus SMP • Sistema de Tickets' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('suporte').setLabel('Suporte').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('denuncia').setLabel('Denúncia').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('parceria').setLabel('Parcerias').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('lore').setLabel('Lore').setStyle(ButtonStyle.Secondary)
    );

    message.channel.send({ embeds: [embed], components: [row] });
  }
});


// 🎟️ INTERAÇÕES
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  // 🔒 FECHAR
  if (interaction.customId === 'fechar_ticket') {
    await interaction.reply({
      content: '🔒 Fechando ticket em 3 segundos...',
      ephemeral: true
    });

    setTimeout(() => {
      interaction.channel.delete();
    }, 3000);

    return;
  }

  // 🎟️ CRIAR TICKET
  if (!['suporte', 'denuncia', 'parceria', 'lore'].includes(interaction.customId)) return;

  await interaction.deferReply({ ephemeral: true });

  let nome = '';
  let descricao = '';
  let cargosPermitidos = [];

  // 📌 DESCRIÇÃO PADRÃO (nova)
  let descricaoPadrao = `Olá! Seu ticket foi aberto com sucesso. 

Um membro da nossa Staff entrará em contato por aqui em até 24 horas para te ajudar e resolver o seu problema.

⚠️ Aviso importante:
Se o seu ticket for sobre denúncias, bugs, modpack ou problemas no servidor, pedimos que você já envie aqui o máximo de detalhes possível.

O envio de prints ou vídeos é fundamental, pois torna muito mais fácil e rápido para a nossa equipe entender a situação e solucionar o seu caso.`;

  if (interaction.customId === 'suporte') {
    nome = 'suporte';
    descricao = descricaoPadrao;
  }

  if (interaction.customId === 'denuncia') {
    nome = 'denuncia';
    descricao = descricaoPadrao;
  }

  if (interaction.customId === 'parceria') {
    nome = 'parceria';
    descricao = descricaoPadrao;
    cargosPermitidos = [
      '1485702214361153696',
      '1485702287606288574',
      '1485702341268209704'
    ];
  }

  if (interaction.customId === 'lore') {
    nome = 'lore';
    descricao = descricaoPadrao;
    cargosPermitidos = [
      '1485702625767850125',
      '1485702684303687730'
    ];
  }

  const cargoSuporte = '1485702478010912768';

  // 🔢 contador
  ticketCount++;
  const ticketNumber = String(ticketCount).padStart(3, '0');

  const permissionOverwrites = [
    {
      id: interaction.guild.id,
      deny: [PermissionsBitField.Flags.ViewChannel],
    },
    {
      id: interaction.user.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages
      ],
    },
    {
      id: cargoSuporte,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages
      ],
    }
  ];

  cargosPermitidos.forEach(id => {
    permissionOverwrites.push({
      id: id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages
      ],
    });
  });

  const channel = await interaction.guild.channels.create({
    name: `${nome}-${ticketNumber}`, // 🏷️ nome com contador
    type: ChannelType.GuildText,
    permissionOverwrites: permissionOverwrites,
  });

  const embed = new EmbedBuilder()
    .setTitle(`🎟️ Ticket de ${nome}`)
    .setDescription(descricao)
    .setColor('#28361b')
    .setFooter({ text: 'Infectus SMP' });

  const fecharBtn = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('fechar_ticket')
      .setLabel('Fechar Ticket')
      .setStyle(ButtonStyle.Danger)
  );

  let mencoes = `<@${interaction.user.id}> <@&${cargoSuporte}>`;
  cargosPermitidos.forEach(id => {
    mencoes += ` <@&${id}>`;
  });

  await channel.send({
    content: mencoes,
    embeds: [embed],
    components: [fecharBtn]
  });

  await interaction.editReply({
    content: `✅ Ticket criado: ${channel}`,
  });
});


// 🔑 TOKEN
client.login(process.env.TOKEN);
