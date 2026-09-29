# applinex package
# Python 3.14 compatibility patch for Django 4.2 template context copying
try:
    import django.template.context as _context
    def _fixed_base_context_copy(self):
        dup = object.__new__(self.__class__)
        dup.__dict__.update(self.__dict__)
        dup.dicts = self.dicts[:]
        return dup
    _context.BaseContext.__copy__ = _fixed_base_context_copy
except Exception:
    pass
