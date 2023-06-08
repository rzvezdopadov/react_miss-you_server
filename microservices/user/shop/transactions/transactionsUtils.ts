import { SHOP_TARIFFS } from "../ishop";
import { PAID_PROPERTY } from "../paid/ipaid";

export function getPaidDiscription(paid: PAID_PROPERTY | SHOP_TARIFFS): string {
	switch (paid) {
		case PAID_PROPERTY.payment:
			return `"Пополнение MY-балов"`;
		case PAID_PROPERTY.messageswrite:
			return `"Написание сообщений"`;
		case PAID_PROPERTY.messagesread:
			return `"Пополнение MY-балов"`;
		case PAID_PROPERTY.longfilters:
			return `"Расширенные фильтры в поиске людей"`;
		case PAID_PROPERTY.filtersvapors:
			return `"Базовые фильтры в лайках"`;
		case PAID_PROPERTY.longfiltersvapors:
			return `"Расширенные фильтры в лайках"`;
		case PAID_PROPERTY.filtersfavoriteusers:
			return `"Базовые фильтры в избранных"`;
		case PAID_PROPERTY.longfiltersfavoriteusers:
			return `"Расширенные фильтры в избранных"`;
		case PAID_PROPERTY.photofull:
			return `"Просмотр больших фото"`;
		case PAID_PROPERTY.photoload10:
			return `"Загрузка до 10 фото"`;
		case PAID_PROPERTY.photoload15:
			return `"Загрузка до 15 фото"`;
		case PAID_PROPERTY.photoload20:
			return `"Загрузка до 20 фото"`;
		case PAID_PROPERTY.photoload25:
			return `"Загрузка до 25 фото"`;
		case PAID_PROPERTY.photoload30:
			return `"Загрузка до 30 фото"`;
		case PAID_PROPERTY.interests20:
			return `"Написание до 20 интересов"`;
		case PAID_PROPERTY.interests30:
			return `"Написание до 30 интересов"`;
		case PAID_PROPERTY.historymessages20:
			return `"До 20 сообщений в истории"`;
		case PAID_PROPERTY.historymessages40:
			return `"До 40 сообщений в истории"`;
		case PAID_PROPERTY.historymessages60:
			return `"До 60 сообщений в истории"`;
		case PAID_PROPERTY.historymessages80:
			return `"До 80 сообщений в истории"`;
		case PAID_PROPERTY.historymessages100:
			return `"До 100 сообщений в истории"`;
		case PAID_PROPERTY.historymessages200:
			return `"До 200 сообщений в истории"`;
		case PAID_PROPERTY.historymessages300:
			return `"До 300 сообщений в истории"`;
		case SHOP_TARIFFS.rating:
			return `"Рейтинг"`;
	}
}
