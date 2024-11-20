"""
File: edit.py
Author: Vyshnavi Adusumelli, Tejaswini Panati, Harshavardhan Bandaru
Date: October 01, 2023
Description: File contains Telegram bot message handlers and their associated functions.

Copyright (c) 2023

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS," WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""

import helper
from telebot import types
from telegram_bot_calendar import DetailedTelegramCalendar, LSTEP
from datetime import datetime

# === Documentation of edit.py ===

def run(m, bot):
    """
    run(message, bot): This is the main function used to implement the delete feature.
    It takes 2 arguments for processing - message which is the message from the user, and
    bot which is the telegram bot object from the main code.py function. It gets the details
    for the expense to be edited from here and passes control onto edit2(m, bot): for further processing.
    """
    chat_id = m.chat.id
    markup = types.ReplyKeyboardMarkup(one_time_keyboard=True)
    markup.row_width = 2
    user_history = helper.getUserHistory(chat_id)
    if not user_history:
        bot.send_message(chat_id,"You have no previously recorded expenses to modify")
        return
    for c in user_history:
        expense_data = c.split(",")
        str_date = "Date=" + expense_data[0]
        str_category = ",\t\tCategory=" + expense_data[1]
        str_amount = ",\t\tAmount=$" + expense_data[2]
        markup.add(str_date + str_category + str_amount)
    info = bot.reply_to(m, "Select expense to be edited:", reply_markup=markup)
    bot.register_next_step_handler(info, select_category_to_be_updated, bot)

def select_category_to_be_updated(m, bot):

    """
    select_category_to_be_updated(m, bot): Handles the user's selection of expense categories for updating.

    Parameters:
    - m (telegram.Message): The message object received from the user.
    - bot (telegram.Bot): The Telegram bot object.

    This function processes the user's selected expense categories, presents options for updating,
    and registers the next step handler for further processing.
    """

    info = m.text
    markup = types.ReplyKeyboardMarkup(one_time_keyboard=True)
    markup.row_width = 2
    selected_data = [] if info is None else info.split(",")
    for c in selected_data:
        markup.add(c.strip())
    choice = bot.reply_to(m, "What do you want to update?", reply_markup=markup)
    updated = []
    bot.register_next_step_handler(choice, enter_updated_data, bot, selected_data, updated)

def enter_updated_data(m, bot, selected_data, updated):

    """
    enter_updated_data(m, bot, selected_data, updated): Handles the user's input for updating expense information.

    Parameters:
    - m (telegram.Message): The message object received from the user.
    - bot (telegram.Bot): The Telegram bot object.
    - selected_data (list): List of selected expense information.
    - updated (list): List of updated categories.

    This function processes the user's choice for updating expense details and registers the next step handlers
    accordingly (date, category, amount).
    """

    choice1 = "" if m.text is None else m.text
    markup = types.ReplyKeyboardMarkup(one_time_keyboard=True)
    markup.row_width = 2
    for cat in helper.getSpendCategories():
        markup.add(cat)

    if "Date" in choice1:
        calendar, step = DetailedTelegramCalendar().build()
        bot.send_message(m.chat.id, f"Select {LSTEP[step]}", reply_markup=calendar)

        @bot.callback_query_handler(func=DetailedTelegramCalendar.func())
        def edit_cal(c):
            chat_id= c.message.chat.id
            result, key, step = DetailedTelegramCalendar().process(c.data)

            if not result and key:
                bot.edit_message_text(
                    f"Select {LSTEP[step]}",
                    c.message.chat.id,
                    c.message.message_id,
                    reply_markup=key,
                )
            elif result:
                data = datetime.today().date()
                if (result > data):
                    bot.send_message(chat_id,"Cannot select future dates, Please try /edit command again with correct dates")
                else:
                    edit_date(bot, selected_data, result, c, updated)
                    bot.edit_message_text(
                        f"Date is updated: {result}",
                        c.message.chat.id,
                        c.message.message_id,
                    )

    if "Category" in choice1:
        new_cat = bot.reply_to(m, "Please select the new category", reply_markup=markup)
        bot.register_next_step_handler(new_cat, edit_cat, bot, selected_data, updated)

    if "Amount" in choice1:
        new_cost = bot.reply_to(
            m, "Please type the new cost\n(Enter only numerical value)"
        )
        bot.register_next_step_handler(new_cost, edit_cost, bot, selected_data, updated)

def update_different_category(m, bot, selected_data, updated):

    """
    update_different_category(m, bot, selected_data, updated): Handles user's choice to update another category.

    Parameters:
    - m (telegram.Message): The message object received from the user.
    - bot (telegram.Bot): The Telegram bot object.
    - selected_data (list): List of selected expense information.
    - updated (list): List of updated categories.

    This function processes the user's choice to update another category and registers the next step handlers accordingly.
    """

    response = m.text
    if response == "Y" or response == "y":
        markup = types.ReplyKeyboardMarkup(one_time_keyboard=True)
        markup.row_width = 2
        for c in selected_data:
            if c not in updated:
                markup.add(c.strip())
        choice = bot.reply_to(m, "What do you want to update?", reply_markup=markup)
        bot.register_next_step_handler(choice, enter_updated_data, bot, selected_data, updated)

def edit_date(bot, selected_data, result, c, updated):
    """
    def edit_date(m, bot): It takes 2 arguments for processing - message which is
    the message from the user, and bot which is the telegram bot object from the
    edit3(m, bot):: function in the same file. It takes care of date change and edits.
    """
    user_list = helper.read_json()
    new_date = datetime.strftime(result, helper.getDateFormat())
    chat_id = c.message.chat.id
    m = c.message
    data_edit = helper.getUserHistory(chat_id)

    for i in range(len(data_edit)):
        user_data = data_edit[i].split(",")
        selected_date = selected_data[0].split("=")[1]
        selected_category = selected_data[1].split("=")[1]
        selected_amount = selected_data[2].split("=")[1]
        if (
            user_data[0] == selected_date and user_data[1] == selected_category and user_data[2] == selected_amount[1:]
        ):
            data_edit[i] = (
                new_date + "," + selected_category + "," + selected_amount[1:]
            )
            break

    user_list[str(chat_id)]["data"] = data_edit
    helper.write_json(user_list)
    new_date_str = "Date=" + new_date
    updated.append(new_date_str)
    selected_data[0] = new_date_str
    if len(updated) == 3:
        bot.send_message(m.chat.id, "You have updated all the categories for this expense")
        return
    resp = bot.send_message(m.chat.id, "Do you want to update another category in this expense?(Y/N)")
    bot.register_next_step_handler(resp, update_different_category, bot, selected_data ,updated)

def edit_cat(m, bot, selected_data, updated):
    """
    def edit_cat(m, bot): It takes 2 arguments for processing - message which is the message
    from the user, and bot which is the telegram bot object from the edit3(m, bot):: function in the
    same file. It takes care of category change and edits.
    """
    user_list = helper.read_json()
    chat_id = m.chat.id
    data_edit = helper.getUserHistory(chat_id)
    new_cat = "" if m.text is None else m.text
    for i in range(len(data_edit)):
        user_data = data_edit[i].split(",")
        selected_date = selected_data[0].split("=")[1]
        selected_category = selected_data[1].split("=")[1]
        selected_amount = selected_data[2].split("=")[1]
        if (
            user_data[0] == selected_date and user_data[1] == selected_category and user_data[2] == selected_amount[1:]
        ):
            data_edit[i] = selected_date + "," + new_cat + "," + selected_amount[1:]
            break

    user_list[str(chat_id)]["data"] = data_edit
    helper.write_json(user_list)
    new_cat_str = "Category=" + new_cat
    updated.append(new_cat_str)
    selected_data[1] = new_cat_str
    bot.reply_to(m, "Category is updated")
    if len(updated) == 3:
        bot.send_message(m.chat.id, "You have updated all the categories for this expense")
        return
    resp = bot.send_message(m.chat.id, "Do you want to update another category in this expense?(Y/N)")
    bot.register_next_step_handler(resp, update_different_category, bot, selected_data, updated)

def edit_cost(m, bot, selected_data, updated):
    """
    def edit_cost(m, bot): It takes 2 arguments for processing - message which is the
    message from the user, and bot which is the telegram bot object from the
    edit3(m, bot):: function in the same file. It takes care of cost change and edits.
    """
    user_list = helper.read_json()
    new_cost = "" if m.text is None else m.text
    chat_id = m.chat.id
    data_edit = helper.getUserHistory(chat_id)

    if helper.validate_entered_amount(new_cost) != 0:
        for i in range(len(data_edit)):
            user_data = data_edit[i].split(",")
            selected_date = selected_data[0].split("=")[1]
            selected_category = selected_data[1].split("=")[1]
            selected_amount = selected_data[2].split("=")[1]
            if (
                user_data[0] == selected_date and user_data[1] == selected_category and user_data[2] == selected_amount[1:]
            ):
                data_edit[i] = selected_date + "," + selected_category + "," + new_cost
                break
        user_list[str(chat_id)]["data"] = data_edit
        helper.write_json(user_list)
        bot.reply_to(m, "Expense amount is updated")
    else:
        bot.reply_to(m, "The cost is invalid")
    new_cost_str = "Category=" + new_cost
    updated.append(new_cost_str)
    selected_data[1] = new_cost_str
    if len(updated) == 3:
        bot.send_message(m.chat.id, "You have updated all the categories for this expense")
        return
    resp = bot.send_message(m.chat.id, "Do you want to update another category in this expense?(Y/N)")
    bot.register_next_step_handler(resp, update_different_category, bot, selected_data, updated)