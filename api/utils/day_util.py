def get_day_name(index):
    days = {
        0: "domingo",
        1: "segunda-feira",
        2: "terça-feira",
        3: "quarta-feira",
        4: "quinta-feira",
        5: "sexta-feira",
        6: "sábado",
    }
    return days.get(index, "Índice inválido")
