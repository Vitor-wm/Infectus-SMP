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

client.once('ready', () => {
  console.log('Bot online!');
});


// 📢 PAINEL
client.on('messageCreate', async (message) => {
  if (message.content === '!ticket') {

  if (message.content === '!loreserve') {
    message.channel.send({ embeds: [loreEmbed] });
  }

    const embed = new EmbedBuilder()
      .setTitle('🎟️ Central de Atendimento - Infectus')
      .setDescription('Escolha uma categoria abaixo para abrir seu ticket.')
      .setColor('#28361b')
      .setFooter({ text: 'Infectus SMP • Sistema de Tickets' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('suporte').setLabel('Suporte').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('denuncia').setLabel('Denúncia').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('parceria').setLabel('Parcerias').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('lore').setLabel('Lore').setStyle(ButtonStyle.Secondary)
    );

    message.channel.send({ embeds: [embed], components: [row] });
  }
});


// 🎟️ INTERAÇÕES
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  // 🔒 FECHAR (sem defer)
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

  // 🎟️ CRIAR TICKET (usa defer aqui)
  if (!['suporte', 'denuncia', 'parceria', 'lore'].includes(interaction.customId)) return;

  await interaction.deferReply({ ephemeral: true });

  let nome = '';
  let descricao = '';
  let cargosPermitidos = [];

  if (interaction.customId === 'suporte') {
    nome = 'suporte';
    descricao = 'Explique seu problema e aguarde a equipe.';
  }

  if (interaction.customId === 'denuncia') {
    nome = 'denuncia';
    descricao = 'Descreva a denúncia com provas.';
  }

  if (interaction.customId === 'parceria') {
    nome = 'parceria';
    descricao = 'Envie informações sobre a parceria.';
    cargosPermitidos = [
      '1485702214361153696',
      '1485702287606288574',
      '1485702341268209704'
    ];
  }

  if (interaction.customId === 'lore') {
    nome = 'lore';
    descricao = 'Envie sua história/lore para avaliação.';
    cargosPermitidos = [
      '1485702625767850125',
      '1485702684303687730'
    ];
  }

  const cargoSuporte = '1485702478010912768';

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
    name: `${nome}-${interaction.user.username}`,
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
});]

const loreEmbed = new EmbedBuilder()
.setColor('#28361b')
.setTitle('☣️ O COLAPSO')
.setDescription(`SEU TEXTO GIGANTE AQUI`);


// 🔑 TOKEN
client.login(process.env.TOKEN);
