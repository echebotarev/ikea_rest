module.exports = {
  currencyCoefficient: 6.2,
  kaspiShopIds: ['001', '002', '003', '004'],
  percent: {
    '001': 65,
    '002': 10,
    '003': 50,
    '004': 50
  },
  lowPercent: {
    '001': 50,
    '003': 40,
    '004': 40
  },
  domainNames: {
    '001': 'aktau',
    '002': 'saransk',
    '003': 'uralsk',
    '004': 'atyrau'
  },
  internetShopId: 604,
  samaraShopId: 442,
  aktauShopId: '001',
  saranskShopId: '002',
  atyrauShopId: '004',
  timeToDeliveryData: {
    lastTimeToOrder: {
      // saturday
      '001': { 6: ' 12:00' },
      // wednesday, saturday
      '002': {
        3: ' 16:00',
        6: ' 12:00'
      },
      '003': { 6: ' 12:00' },
      '004': { 6: ' 12:00' }
    },
    lastOrderDay: {
      // saturday
      '001': [6],
      // wednesday-saturday
      '002': [3, 6],
      '003': [6],
      '004': [6]
    },
    deliveryDay: {
      // суббота
      '001': [6],
      // четверг-пятница
      '002': [2, 5],
      // среда
      '003': [3],
      // четверг
      '004': [4]
    },
    shoppingDay: {
      '001': [1],
      '002': [1, 4],
      '003': [1],
      '004': [1]
    },
    timezone: {
      '001': 'Asia/Aqtau',
      '002': 'Europe/Moscow',
      '003': 'Asia/Oral',
      '004': 'Asia/Atyrau'
    }
  },
  categoriesDict: {
    od003: 1,
    bm001: 2,
    bm003: 3,
    bm002: 4,
    tl004: 5,
    wt001: 6,
    pt001: 7,
    lt001: 8,
    he001: 9,
    ka002: 10,
    hi001: 11,
    sp001: 12,
    pp001: 13,
    pp004: 14,
    pp003: 15,
    od001: 16,
    lc001: 17,
    rm001: 18,
    ba003: 19,
    ba002: 20,
    ba001: 21,
    tl003: 22,
    li002: 23,
    li001: 24,
    kt002: 25,
    kt001: 26,
    kt003: 27,
    fb001: 28,
    de001: 29,
    tl002: 30,
    bc001: 31,
    bc002: 32,
    bc003: 33,
    tl001: 34,
    st007: 35,
    ka001: 36,
    ka003: 37,
    st005: 38,
    st006: 39,
    st001: 40,
    st002: 41,
    st003: 42,
    st004: 43,
    ka005: 44,
    fu002: 45,
    fu006: 46,
    bc004: 47,
    fu003: 48,
    fu004: 49,
    fu001: 50,
    fu005: 51,
    ss001: 52
  },
  // ключ сравнивается с utag.category
  googleCategoriesIdDict: {
    fu001: 436,
    st002: 464,
    11465: 464,
    45781: 6394,
    47083: 6356,
    10810: 457,
    47084: 6356,
    14885: 457,
    10412: 447,
    18707: 6356,
    10385: 6356,
    18723: 6394,
    45848: 505764,
    43631: 6356,
    43632: 4063,
    43633: 4063,
    48007: 4063,
    43634: 4063,
    16295: 442,
    49233: 2559,
    46082: 2507,
    45816: 3358,
    45815: 559,
    18769: 559,
    24715: 443,
    10475: 457,
    45849: 6433,
    45847: 6433,
    19048: 6433,
    18775: 6433,
    43635: 6356,
    48006: 6356,
    43636: 6356,
    49079: 6356,
    48005: 6356,
    19053: 6356,
    10664: 599,
    10984: 599,
    10382: 465,
    10397: 6356,
    10996: 599,
    30454: 448,
    st004: 6356,
    46081: 7255,
    10711: 7255,
    47081: 7255,
    47082: 6362,
    10410: 448,
    10451: 7255,
    18708: 7255,
    24337: 6356,
    19110: 6356,
    19106: 6356,
    46053: 6356,
    40206: 6356,
    20087: 6356,
    19112: 6356,
    19115: 6356,
    19113: 6356,
    42242: 6356,
    19086: 6356,
    12151: 6356,
    15908: 6356,
    12150: 6356,
    14949: 4700,
    29882: 6356,
    49096: 6433,
    10409: 6356,
    st003: 447,
    12158: 6356,
    12152: 6356,
    12153: 457,
    25205: 6433,
    19039: 6433,
    16284: 6433,
    19047: 3089,
    19049: 6433,
    19037: 3089,
    16285: 6433,
    19046: 6433,
    fu005: 636,
    bm003: 6433,
    20858: 7255,
    16248: 100,
    16254: 5181,
    45782: 559,
    20611: 635,
    27821: 100,
    16255: 5181,
    10728: 441,
    20542: 4453,
    20864: 1463,
    19144: 443,
    22659: 3358,
    34006: 443,
    25223: 505763,
    20654: 2045,
    22660: 441,
    25222: 3358,
    25221: 443,
    25220: 5886,
    25219: 5886,
    20652: 443,
    20653: 443,
    47068: 443,
    47067: 6800,
    fu002: 443,
    18768: 4191,
    10693: 460,
    47391: 460,
    10662: 460,
    10670: 460,
    10671: 460,
    35191: 460,
    10690: 460,
    10668: 460,
    10663: 460,
    31786: 460,
    20874: 460,
    20857: 2696,
    49766: 6363,
    16235: 460,
    45783: 558,
    39130: 460,
    16238: 460,
    10661: 460,
    fu003: 460,
    36212: 6392,
    19143: 6392,
    20862: 6392,
    36209: 6392,
    25206: 4080,
    10717: 1549,
    47424: 6392,
    11811: 4191,
    11845: 6911,
    18963: 923,
    11844: 6910,
    47427: 923,
    47426: 4191,
    18623: 4191,
    47425: 6910,
    18960: 4191,
    18966: 6910,
    18965: 6911,
    18962: 4191,
    30572: 6910,
    35187: 3358,
    fu004: 6392,
    20657: 6392,
    16246: 6392,
    10705: 1549,
    24714: 4191,
    47070: 4191,
    47069: 4191,
    24830: 5489,
    20651: 4191,
    20649: 4191,
    21825: 4355,
    21827: 4355,
    21826: 4355,
    47747: 4355,
    21828: 4355,
    21829: 4080,
    36213: 4355,
    47423: 4191,
    10716: 1395,
    19145: 4355,
    20927: 3358,
    20929: 3358,
    20926: 3358,
    20928: 3358,
    fu006: 443,
    20483: 443,
    35184: 443,
    10696: 443,
    49152: 505384,
    35186: 443,
    10687: 443,
    20907: 443,
    16296: 6499,
    10694: 443,
    53257: 443,
    49150: 6267,
    49151: 985,
    49149: 6267,
    49160: 985,
    25228: 2816,
    14973: 6267,
    14972: 7400,
    47431: 505384,
    47430: 2962,
    30436: 703,
    10779: 6762,
    16257: 540,
    16292: 1167,
    49768: 1167,
    16293: 1167,
    40845: 6295,
    42925: 2302,
    17894: 719,
    24331: 719,
    34205: 6964,
    31787: 985,
    24898: 2985,
    20493: 6318,
    20494: 6428,
    16256: 540,
    16249: 540,
    18734: 1239,
    20474: 464,
    18736: 1239,
    18740: 1239,
    20484: 1239,
    18738: 1239,
    18735: 3731,
    18737: 1239,
    21958: 636,
    17887: 719,
    34204: 8522,
    20609: 623,
    16213: 4516,
    48925: 464,
    20601: 634,
    48940: 637,
    16215: 637,
    34470: 637,
    16214: 5608,
    20602: 2677,
    20608: 633,
    14971: 6267,
    17897: 6267,
    10744: 3329,
    li002: 4636,
    15938: 4975,
    20562: 3072,
    20561: 4343,
    700195: 4971,
    700196: 3268,
    700194: 2796,
    24262: 3268,
    700193: 4875,
    45852: 6950,
    15927: 2948,
    45853: 3553,
    15935: 3475,
    15949: 3475,
    20669: 4530,
    45854: 639,
    20560: 3072,
    33499: 668,
    33500: 4746,
    20667: 653,
    33498: 668,
    18773: 3006,
    10732: 4636,
    18750: 2524,
    20502: 4636,
    20503: 6073,
    18753: 2524,
    20505: 6073,
    20504: 6073,
    20514: 3329,
    20516: 3006,
    10803: 3185,
    10805: 3006,
    10804: 3185,
    10731: 10731,
    18751: 2524,
    18752: 2524,
    20506: 2524,
    16281: 4636,
    16283: 4636,
    18865: 668,
    20636: 668,
    20645: 668,
    18867: 668,
    18866: 668,
    20643: 8006,
    20621: 6740,
    18864: 3941,
    16048: 4009,
    20634: 661,
    20635: 661,
    18862: 3941,
    20633: 661,
    31774: 654,
    22668: 654,
    15928: 640,
    18863: 672,
    22665: 4423,
    20630: 662,
    20631: 664,
    22664: 658,
    kt001: 668,
    20620: 3800,
    16043: 4026,
    16047: 3802,
    20619: 3802,
    18860: 672,
    31781: 5647,
    18861: 3553,
    20622: 1557,
    16045: 2169,
    15950: 2344,
    20606: 667,
    15951: 2344,
    22663: 2712,
    18871: 3330,
    18872: 2976,
    18869: 2951,
    18870: 2712,
    15947: 666,
    16309: 3144,
    15946: 665,
    18849: 752,
    42926: 592,
    10574: 3079,
    10785: 3890,
    10786: 4546,
    16308: 3802,
    20491: 2784,
    20519: 577,
    10778: 721,
    pp004: 721,
    20479: 573,
    10776: 602,
    39266: 3329,
    10783: 500121,
    10782: 588,
    10784: 2784,
    20492: 6265,
    20496: 6936,
    24924: 11,
    16306: 4054,
    24831: 95,
    10787: 500044,
    10789: 597,
    49139: 595,
    10788: 50004,
    18746: 597,
    24861: 595,
    24859: 595,
    24860: 595,
    24858: 595,
    10759: 3890,
    16202: 939,
    10797: 5631,
    10565: 5631,
    10698: 2675,
    20544: 598,
    14349: 47,
    16201: 573,
    10695: 598,
    39267: 598,
    20543: 598,
    10699: 598,
    10689: 598,
    10692: 598,
    20537: 670,
    46400: 6964,
    46401: 4454,
    18780: 6254,
    18724: 2696,
    20477: 8058,
    49763: 4700,
    20481: 2446,
    45788: 939,
    49142: 6356,
    18706: 6356,
    18852: 639,
    18698: 6254,
    18699: 1243,
    18700: 4077,
    18695: 2974,
    22157: 2974,
    18694: 1985,
    18692: 4171,
    18893: 499772,
    18890: 2927,
    10681: 2314,
    10680: 4171,
    18892: 6257,
    18894: 6254,
    18696: 6346,
    10700: 2882,
    18908: 580,
    18774: 1243,
    10701: 2885,
    18776: 4171,
    31773: 4171,
    20528: 2974,
    31772: 561,
    45924: 552,
    45925: 548,
    18721: 1239,
    18717: 1239,
    18719: 1239,
    45728: 1243,
    18720: 1239,
    45855: 5628,
    18904: 4454,
    18902: 4454,
    18903: 2927,
    18777: 2700,
    18851: 4257,
    20539: 2547,
    20541: 4143,
    20826: 2549,
    10736: 3006,
    20723: 1687,
    20859: 441,
    46079: 500000,
    22957: 8161,
    16233: 6858,
    48945: 552,
    39269: 2302,
    40692: 1673,
    20804: 574,
    20498: 595,
    40691: 2032,
    48924: 4700,
    20722: 2410,
    30565: 6910,
    20720: 500000,
    20808: 5938,
    20721: 5938,
    20806: 6356,
    40693: 499999,
    49138: 595,
    20500: 5938,
    48927: 574,
    10657: 574,
    20499: 476,
    48943: 585,
    20521: 4077,
    20522: 4077,
    20523: 576,
    20524: 576,
    20525: 4077,
    48944: 583,
    48931: 5631,
    10650: 2446,
    10656: 4971,
    10658: 574,
    20615: 575,
    16200: 464,
    10471: 6374,
    46458: 2729,
    24263: 2757,
    24256: 3268,
    24260: 6446,
    48987: 4516,
    48988: 730,
    48986: 8161,
    48989: 2032,
    46459: 2729,
    46457: 2729,
    10482: 2032,
    20810: 730,
    20823: 686,
    33504: 679,
    20824: 686,
    20821: 499873,
    33515: 730,
    33516: 730,
    20813: 679,
    20814: 679,
    20825: 680,
    33508: 684,
    20820: 684,
    33507: 684,
    48978: 8161,
    48979: 2032,
    48982: 730,
    48980: 4700,
    24264: 2729,
    24259: 4516,
    24258: 7255,
    50383: 730,
    50384: 679,
    50385: 684,
    50388: 686,
    50389: 730,
    50387: 680,
    50390: 2549,
    33546: 2729,
    24257: 3831,
    50005: 8161,
    23615: 8161,
    50003: 2728,
    23611: 4700,
    23609: 8161,
    23607: 8161,
    49118: 3266,
    49117: 7255,
    23608: 6934,
    16298: 4700,
    20677: 2446,
    46476: 7053,
    20678: 2446,
    46475: 7053,
    46473: 7053,
    19064: 451,
    24824: 4452,
    21959: 6368,
    37899: 4299,
    47360: 6347,
    35768: 464,
    42247: 464,
    47398: 6372,
    47399: 464,
    47402: 464,
    35769: 464,
    11704: 464,
    47403: 464,
    14319: 464,
    14318: 464,
    47396: 5558,
    41686: 7255,
    37897: 5558,
    45731: 5558,
    45732: 5558,
    46080: 464,
    21967: 6367,
    21961: 6368,
    21962: 443,
    21966: 6828,
    21965: 2684,
    700192: 2684,
    21960: 4513,
    20527: 2974,
    20532: 1985,
    20531: 2541,
    20530: 1985,
    20534: 2700,
    46083: 2700,
    20536: 2700,
    20535: 2700,
    20656: 462,
    24823: 2696,
    24828: 2696,
    24826: 2696,
    24827: 2720,
    19059: 636,
    10454: 5559,
    10456: 5559,
    10459: 105,
    10573: 939,
    10567: 503765,
    47380: 5559,
    20618: 631,
    37900: 2446,
    16195: 2986,
    49769: 4244,
    49770: 4244,
    10455: 4244,
    20617: 5707,
    20659: 7092,
    20660: 6372,
    20658: 6372,
    10398: 6372
  }
};
